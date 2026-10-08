import React,{useCallback,useEffect,useRef,useState} from 'react'
import {createWorld} from './world.js'
import {LOCATIONS,locationById,nextLocation} from './locations.js'
import QuickView from './QuickView.jsx'
import {getHotspot} from './portfolioContent.js'
import {RAIL_DURATIONS,railStageLabel} from './livingJourney.js'
import {PHASES,initialJourney,nextJourneyState} from './trainJourney.js'

function TrainIcon(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="5" y="2" width="14" height="18" rx="4"/><path d="M5 11h14M9 7h6M8 22l2-2m4 0 2 2M8 16h.2M15.8 16h.2"/></svg>}
function Arrow(){return <span aria-hidden="true">↗</span>}

export default function App(){
  const holder=useRef(null),world=useRef(null),travelFn=useRef(null),busy=useRef(false),timer=useRef(0),stageRef=useRef(''),journeyRef=useRef(initialJourney())
  const [here,setHere]=useState('kyoto')
  const [near,setNear]=useState(false)
  const [nearStory,setNearStory]=useState(null)
  const [storyId,setStoryId]=useState(null)
  const storyFocus=useRef(null)
  const [pos,setPos]=useState({x:0,z:16})
  const [error,setError]=useState('')
  const [traveling,setTraveling]=useState(false)
  const [travelStage,setTravelStage]=useState('')
  const [weather,setWeather]=useState('golden')
  const [going,setGoing]=useState('tokyo')
  const [open,setOpen]=useState(true)
  const [guide,setGuide]=useState(false)
  const [quickView,setQuickView]=useState(false)
  const closeQuickView=useCallback(()=>setQuickView(false),[])
  const active=locationById(here),next=nextLocation(here)
  const story=getHotspot(storyId)
  function finishJourney(){
    window.clearTimeout(timer.current)
    stageRef.current=''
    journeyRef.current=initialJourney()
    world.current?.setJourneyPhase?.('')
    busy.current=false
    setTraveling(false)
    setTravelStage('')
  }
  function showJourneyStage(stage,id){
    window.clearTimeout(timer.current)
    stageRef.current=stage
    setTravelStage(stage)
    if(!stage){finishJourney();return}
    if(stage==='reveal'){
      try{world.current?.setRegion(id);setHere(id);setOpen(true)}
      catch(err){setError(err?.message||'Unable to load arrival.');finishJourney();return}
    }
    world.current?.setJourneyPhase?.(stage)
    timer.current=window.setTimeout(()=>advanceJourney(stage,id),RAIL_DURATIONS[stage])
  }
  // The existing train finite-state model is authoritative; timers only mark
  // the completion of visible avatar/cabin animations in the 3D renderer.
  function advanceJourney(stage,id){
    const events={boarding:'AVATAR_ENTERED',window:'ARRIVED',reveal:'DISEMBARK',exiting:'AVATAR_EXITED'}
    journeyRef.current=nextJourneyState(journeyRef.current,{type:events[stage]})
    const view={
      [PHASES.BOARDING]:'boarding',
      [PHASES.WINDOW]:'window',
      [PHASES.REVEAL]:'reveal',
      [PHASES.EXITING]:'exiting'
    }[journeyRef.current.phase]
    if(view)showJourneyStage(view,id)
    else finishJourney()
  }
  function travel(id){
    if(busy.current||world.current?.current()===id)return
    journeyRef.current=initialJourney()
    for(const event of [
      {type:'APPROACH_STATION'},
      {type:'OPEN_ROUTE_MAP'},
      {type:'CHOOSE_DESTINATION',destination:id},
      {type:'BOARD'}
    ])journeyRef.current=nextJourneyState(journeyRef.current,event)
    if(journeyRef.current.phase!==PHASES.BOARDING)return
    busy.current=true
    setStoryId(null);setNearStory(null);setGoing(id);setTraveling(true)
    world.current?.setInputEnabled?.(false)
    showJourneyStage('boarding',id)
  }
  function skipJourney(){
    if(!busy.current)return
    journeyRef.current=nextJourneyState(journeyRef.current,{type:'SKIP'})
    const phase=journeyRef.current.phase
    if(phase===PHASES.REVEAL)showJourneyStage('reveal',going)
    else if(phase===PHASES.EXITING)showJourneyStage('exiting',going)
  }
  travelFn.current=travel
  useEffect(()=>{
    try{world.current=createWorld(holder.current,{
      onNearby:setNear,onPosition:setPos,onError:setError,
      onNearHotspot:setNearStory,onHotspot:setStoryId,
      onBoard:id=>travelFn.current(nextLocation(id).id)
    })}catch(err){setError(err?.message||'3D could not start.')}
    return()=>{window.clearTimeout(timer.current);world.current?.dispose();world.current=null}
  },[])
  useEffect(()=>{world.current?.setInputEnabled?.(!quickView&&!storyId&&!traveling)},[quickView,storyId,traveling])
  useEffect(()=>{world.current?.setWeather?.(weather)},[weather])
  useEffect(()=>{
    if(!traveling)return
    const onEscape=e=>{if(e.key==='Escape'){e.preventDefault();skipJourney()}}
    window.addEventListener('keydown',onEscape)
    return()=>window.removeEventListener('keydown',onEscape)
  },[traveling,going])
  useEffect(()=>{
    if(!storyId)return
    storyFocus.current?.focus()
    const close=e=>{if(e.key==='Escape'){e.preventDefault();setStoryId(null)}}
    window.addEventListener('keydown',close)
    return()=>{window.removeEventListener('keydown',close);holder.current?.focus?.()}
  },[storyId])
  function inputButton(key,character,title){
    const release=()=>world.current?.setInput(key,false)
    return <button className="touch-key" key={key} aria-label={title}
      onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture?.(e.pointerId);world.current?.setInput(key,true)}}
      onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>{character}</button>
  }
  return <div className="experience" style={{'--accent':active.accent}}>
    <div className="canvas" ref={holder} role="region" tabIndex={0} aria-label={'Interactive 3D Japanese destination: '+active.city}/>
    <div className="vignette" aria-hidden="true"/>
    <header className="header">
      <a className="brand" href="https://github.com/DevinEldrian" target="_blank" rel="noopener noreferrer" aria-label="Devin GitHub profile">
        <span className="brand-symbol" lang="ja">旅</span><span><strong>DEVIN<span className="brand-period">.</span></strong><small>AN INTERACTIVE JOURNEY</small></span>
      </a>
      <div className="header-mode"><i/> WORLD EXPLORER <span>/</span> JAPAN 2026</div>
      <div className="qv-header-actions"><button className="qv-open" onClick={()=>setQuickView(true)}>QUICK VIEW ↗</button><button className="guide-toggle" onClick={()=>setGuide(x=>!x)}>{guide?'CLOSE GUIDE':'HOW TO PLAY'} <Arrow/></button></div>
    </header>
    <main className="main">
      <section className="hero" aria-live="polite">
        <div className="top-label"><span/> THE WORLD OF DEVIN ELDRIAN WIJAYA</div>
        <div className="location-index"><em>{active.number}</em><b/> JAPAN</div>
        <h1>{active.city}<span>.</span></h1>
        <div className="japanese" lang="ja">{active.jp}</div>
        <div className="hero-line"/>
        <div className="district"><span/> {active.district}</div>
        <h2>{active.title}</h2>
        <p className="hero-description">{active.description}</p>
        <button className="explore" onClick={()=>setOpen(x=>!x)}>{open?'HIDE DETAILS':'EXPLORE '+active.section.toUpperCase()} <span>→</span></button>
      </section>
      <nav className="navigation" aria-label="Journey destinations">
        <div className="nav-label">DESTINATIONS <span>— 04 STOPS</span></div>
        <div className="route">{LOCATIONS.map(loc=><button key={loc.id} disabled={traveling} aria-current={loc.id===here?'location':undefined}
          onClick={()=>travel(loc.id)} className={'route-row '+(loc.id===here?'selected':'')}>
          <span className="stop-circle"><span/></span><small>{loc.number}</small>
          <span className="route-place"><strong>{loc.city}</strong><em>{loc.section}</em></span>
          <b>↗</b>
        </button>)}</div>
        <div className="route-foot"><TrainIcon/> JAPAN RAIL JOURNEY <span/></div>
      </nav>
    </main>
    <div className="vertical-japanese" lang="ja">旅はまだ続く</div>
    {open&&<aside className="detail-panel" aria-label={active.section+' details'}>
      <div className="panel-heading">{active.section.toUpperCase()} <span>✳</span><button onClick={()=>setOpen(false)} aria-label="Close details">×</button></div>
      <h3>{active.panel}</h3><p>{active.detail}</p>
      <ul>{active.points.map((point,i)=><li key={point}><span>0{i+1}</span>{point}</li>)}</ul>
      {here==='kamakura'&&<a className="github-cta" href="https://github.com/DevinEldrian" target="_blank" rel="noopener noreferrer">CONNECT ON GITHUB ↗</a>}
      <span className="panel-kanji" lang="ja">{active.jp}</span>
    </aside>}
    {here==='kyoto'&&<div className="weather-mode" role="group" aria-label="Kyoto weather">
      <span>ARASHIYAMA · AUTUMN</span>
      <button aria-pressed={weather==='golden'} onClick={()=>setWeather('golden')}>GOLDEN HOUR</button>
      <button aria-pressed={weather==='drizzle'} onClick={()=>setWeather('drizzle')}>LIGHT DRIZZLE</button>
    </div>}
    {guide&&<aside className="guide" aria-label="Controls"><h3>EXPLORER'S GUIDE</h3>
      <p><kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd><span>Move avatar</span></p>
      <p><kbd>SHIFT</kbd><span>Run faster</span></p>
      <p><kbd>E</kbd><span>Read CV kiosk / board train</span></p>
      <p><kbd>ESC</kbd><span>Close story / skip travel</span></p>
      <p><span>Click city on right →</span><span>Travel by train</span></p>
      <small>Locations are stylized artistic interpretations of Japan.</small>
    </aside>}
    <footer className="hud">
      <div className="map-info"><div className="minimap"><div className="roads"/><i className="station-point"/><i className="you-point" style={{left:Math.max(6,Math.min(90,50+pos.x*.47))+'%',top:Math.max(8,Math.min(90,50+pos.z*.47))+'%'}}/><span>N ↑</span></div><div className="map-legend"><small>YOU ARE EXPLORING</small><strong>{active.city} <i>· {active.number}</i></strong><em>自由に歩く · Free roam</em></div></div>
      <div className="key-hint"><div className="wasd"><span>W</span><div><span>A</span><span>S</span><span>D</span></div></div><p>MOVE<small>SHIFT TO RUN</small></p></div>
      <div className="touch-controls"><div>{inputButton('w','↑','Move forward')}</div><div>{inputButton('a','←','Move left')}{inputButton('s','↓','Move backward')}{inputButton('d','→','Move right')}</div></div>
      <div className="cta-group">
        {nearStory&&!storyId&&<button className="board-cta" onClick={()=>setStoryId(nearStory)}><kbd>E</kbd> READ CV STORY ✦</button>}
        {near&&!nearStory&&<button className="board-cta" onClick={()=>world.current?.board()}><kbd>E</kbd> BOARD TRAIN <TrainIcon/></button>}
        <button className="next-cta" disabled={traveling} onClick={()=>travel(next.id)}><span><small>NEXT DESTINATION</small><strong>{next.city} <span>→</span></strong></span><i><TrainIcon/></i></button>
      </div>
    </footer>
    <div className="footer-caption">A PORTFOLIO YOU CAN WALK THROUGH <span>✳</span> MADE WITH CURIOSITY</div>
    {traveling&&<div className="transit" role="status" aria-live="polite">
      <div className="train-text">
        <span>JAPAN RAIL · CINEMATIC TRANSFER</span>
        <TrainIcon/>
        <h2>{locationById(going).city}</h2>
        <p>{railStageLabel(travelStage)}</p>
        <small>Scenic journey is stylized; not a direct Randen service to every destination.</small>
        <div className="rail-phase-list" aria-label="Train trip progress">
          {['boarding','window','reveal','exiting'].map(x=><span key={x} data-active={travelStage===x}>{x.toUpperCase()}</span>)}
        </div>
        <button type="button" className="skip-journey" onClick={skipJourney}>SKIP TO ARRIVAL ↗</button>
      </div>
    </div>}
    {error&&<div className="error-backdrop" role="alert"><div className="error-card"><small>3D ENGINE</small><h2>We lost the scenery.</h2><p>{error}</p><p>Try reloading, updating the browser or enabling hardware acceleration.</p><button onClick={()=>setQuickView(true)}>OPEN CV / QUICK VIEW ↗</button> <button onClick={()=>location.reload()}>RELOAD EXPERIENCE ↗</button></div></div>}
    {story&&<div className="story-shade" onMouseDown={e=>{if(e.target===e.currentTarget)setStoryId(null)}}>
      <aside className="story-sheet" role="dialog" aria-modal="true" aria-label={story.label} tabIndex={-1} ref={storyFocus}>
        <header><small>EXPLORE MY JOURNEY · {story.kind.toUpperCase()}</small>
          <button type="button" onClick={()=>setStoryId(null)} aria-label="Close career story">×</button></header>
        <h2>{story.label}</h2><p className="story-subtitle">{story.subtitle}</p>
        <h3>{story.teaser}</h3><p>{story.story}</p>
        <h4>WHAT I DID · EVIDENCE</h4>
        <ul>{story.evidence.map(x=><li key={x}>{x}</li>)}</ul>
        <p className="story-note">{story.note}</p>
        <div className="story-actions"><button onClick={()=>{setStoryId(null);setQuickView(true)}}>VIEW FULL CV ↗</button>
          <button onClick={()=>setStoryId(null)}>RETURN TO EXPLORATION</button></div>
      </aside>
    </div>}
    {quickView&&<QuickView onClose={closeQuickView}/>}
  </div>
}
