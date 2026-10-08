import React,{useEffect,useRef,useState} from 'react'
import {createAtlas} from './atlasScene.js'
import './atlas.css'

export const WORLD_DESTINATIONS=Object.freeze([
  {name:'AKIHABARA',ja:'秋葉原',subtitle:'NEON / TECHNOLOGY / SKILLS',id:'tokyo',number:'01',description:'A living district of electronics, arcades and original neon signs. Skills, learning and digital craft.'},
  {name:'SHIBUYA',ja:'渋谷',subtitle:'SCRAMBLE / MOVEMENT / PROJECTS',id:'hakone',number:'02',description:'A metropolis in motion: the famous diagonal crossing, traffic, luminous screens and animated crowds.'},
  {name:'ARASHIYAMA',ja:'嵐山',subtitle:'BAMBOO / RIVER / REFLECTION',id:'kyoto',number:'03',description:'Morning mist, the Sagano bamboo path, Katsura water and Togetsukyo-inspired bridge. Read the CV stories along the route.'},
  {name:'KYOTO',ja:'京都',subtitle:'HERITAGE / CRAFT / EXPERIENCE',id:'kamakura',number:'04',description:'Atmospheric machiya streets, tiled roofs, warm lanterns, stone paths and a journey through craft and career.'}
])

export default function WorldAtlas({onStart,onQuickView}){
  const viewport=useRef(null)
  const [focus,setFocus]=useState(2)
  const [error,setError]=useState(false)
  const selected=WORLD_DESTINATIONS[focus]
  const start=(id=selected.id)=>onStart?.(id)
  useEffect(()=>{
    let dispose
    try{
      dispose=createAtlas(viewport.current,{onSelect:start})
    }catch(err){
      console.error('3D atlas unavailable; accessible destination selection remains active',err)
      setError(true)
    }
    return()=>dispose?.()
  },[])
  return <main className="kiseki-atlas">
    <div ref={viewport} className="atlas-webgl" role="img" aria-label="Animated real-time 3D overview of Japanese districts, station and railway connecting Akihabara, Arashiyama and Kyoto"/>
    <div className="atlas-grain" aria-hidden="true"/>
    <div className="atlas-topbar">
      <div className="atlas-brand"><i aria-hidden="true">鳥</i><span><b>KISEKI</b><small>奇跡 · A JOURNEY THROUGH MY WORLD</small></span></div>
      <div className="atlas-status">3D WORLD OVERVIEW <span>·</span> JAPAN-INSPIRED</div>
      <button className="atlas-quick" onClick={onQuickView}>QUICK CV VIEW ↗</button>
    </div>
    <section className="atlas-copy">
      <div className="atlas-eyebrow">DEVELOPED AS A REAL INTERACTIVE WEBGL EXPERIENCE</div>
      <h1>JAPAN, <em>BEYOND</em><br/>THE RAILS.</h1>
      <p>Perjalanan profesional yang dapat dijelajahi. Dunia Jepang yang saling terhubung oleh kereta—kota neon, hutan bambu, jalan bersejarah, dan cerita nyata di setiap persinggahan.</p>
      <div className="atlas-action">
        <button className="atlas-start" onClick={()=>start()}>MULAI PERJALANAN <span>↗</span></button>
        <button className="atlas-cv" onClick={onQuickView}>LIHAT CV TANPA BERMAIN</button>
      </div>
      <div className="atlas-explain">WASD TO WALK <span>✦</span> E TO DISCOVER <span>✦</span> RAILWAY BETWEEN WORLDS</div>
      {error&&<div className="atlas-error" role="status">Pratinjau 3D membutuhkan WebGL. Destinasi dan CV tetap tersedia melalui tombol di halaman ini.</div>}
    </section>
    <section className="atlas-destinations" aria-label="Four immersive Japanese destinations">
      <div className="atlas-section-heading"><span>DESTINASI KISEKI</span><small>FOUR ENVIRONMENTS · ONE JOURNEY</small></div>
      {WORLD_DESTINATIONS.map((item,i)=><button key={item.number}
        className={'atlas-destination '+(i===focus?'atlas-destination-active':'')}
        onMouseEnter={()=>setFocus(i)} onFocus={()=>setFocus(i)}
        onClick={()=>start(item.id)}>
        <span className="atlas-dest-index">{item.number}</span>
        <span className="atlas-dest-name"><b>{item.name}</b><small>{item.ja} · {item.subtitle}</small></span>
        <span className="atlas-dest-arrow">↗</span>
      </button>)}
      <div className="atlas-selected"><div className="atlas-selected-title">NOW SELECTED <b>{selected.name}</b></div><p>{selected.description}</p></div>
    </section>
    <footer className="atlas-footer">
      <span>WORLD MAP <i>—</i> EXPLORATION <i>—</i> RAIL TRAVEL <i>—</i> CAREER STORY</span>
      <span>DEVIN ELDRIAN WIJAYA · INTERACTIVE PORTFOLIO 2026</span>
    </footer>
  </main>
}
