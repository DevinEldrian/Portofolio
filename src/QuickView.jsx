import React,{useEffect,useRef,useState} from 'react'
import {HOTSPOTS} from './portfolioContent.js'
import './quickView.css'

const SECTIONS=[
  {id:'about',label:'About'},
  {id:'work',label:'Featured Work'},
  {id:'experience',label:'Experience'},
  {id:'skills',label:'Skills'},
  {id:'cv',label:'CV'},
  {id:'contact',label:'Contact'}
]
const initialTab='about'
function SectionContent({tab}){
  if(tab==='about')return <div className="qv-story">
    <p className="qv-eyebrow">DEVIN ELDRIAN WIJAYA · JAKARTA, INDONESIA</p>
    <h2>Curiosity meets<br/><em>reliability.</em></h2>
    <p>I’m an IT Quality Assurance professional with experience in testing business-critical workflows and contributing to thoughtful UI improvements. I’m interested in the intersection of dependable systems, people and interactive experiences.</p>
    <div className="qv-quote">“A great experience is not only what users see. It is everything they can trust.”</div>
    <p className="qv-caveat">Personal narrative is a draft for portfolio review.</p>
  </div>
  if(tab==='work')return <div className="qv-story">
    <p className="qv-eyebrow">SELECTED WORK · REFERENCE PROJECTS</p>
    <h2>Systems with <em>purpose.</em></h2>
    <p>These are high-level summaries of professional experience, not replicas of confidential systems. This interactive portfolio is itself a work in progress.</p>
    <div className="qv-work-grid">{HOTSPOTS.filter(x=>x.kind==='experience').map(x=><article key={x.id} className="qv-work-card">
      <span>{x.subtitle}</span><h3>{x.label}</h3><p>{x.teaser}</p>
    </article>)}</div>
    <a className="qv-action" href="https://github.com/DevinEldrian/Portofolio" target="_blank" rel="noopener noreferrer">SEE PORTFOLIO SOURCE ↗</a>
  </div>
  if(tab==='experience')return <div className="qv-story">
    <p className="qv-eyebrow">PROFESSIONAL JOURNEY</p><h2>The path <em>so far.</em></h2>
    {HOTSPOTS.filter(x=>x.kind==='experience').reverse().map(x=><article className="qv-timeline" key={x.id}>
      <h3>{x.label}</h3><small>{x.subtitle}</small><p>{x.story}</p>
      <ul>{x.evidence.map(b=><li key={b}>{b}</li>)}</ul>
    </article>)}
  </div>
  if(tab==='skills')return <div className="qv-story">
    <p className="qv-eyebrow">SKILLS / TOOLKIT</p><h2>Always <em>learning.</em></h2>
    {[
      ['Quality Engineering',['Functional Testing','Regression Testing','User Acceptance Testing','Test Case Design','Integration Testing']],
      ['Technology',['SQL','Python','Microsoft Excel']],
      ['Product & Design',['UI/UX Design','Frontend UI implementation','Collaboration & defect reporting']],
    ].map(([group,skills])=><section className="qv-skills" key={group}><h3>{group}</h3><div>{skills.map(s=><span key={s}>{s}</span>)}</div></section>)}
  </div>
  if(tab==='cv')return <div className="qv-story">
    <p className="qv-eyebrow">CURRICULUM VITAE</p><h2>Beyond <em>the game.</em></h2>
    <p>Explore the full professional overview in readable HTML, with no need to move a character or load WebGL.</p>
    <div className="qv-work-card"><h3>Education</h3><p>BINUS University — Business Information Technology, major in Artificial Intelligence for Business. Graduation status to be confirmed before publishing the downloadable CV.</p></div>
    <div className="qv-work-card"><h3>Experience</h3><p>Quality Assurance IT · Bank Negara Indonesia (2026–present)</p><p>Information Technology Intern · Sinarmas Insurance (2024–2025)</p></div>
    <p className="qv-caveat">A PDF download is intentionally withheld until the final CV content and public contact details are approved.</p>
  </div>
  return <div className="qv-story">
    <p className="qv-eyebrow">CONTACT</p><h2>Let’s make <em>something better.</em></h2>
    <p>Have a professional opportunity, a thoughtful question, or an interesting collaboration in mind? Get in touch through GitHub.</p>
    <a className="qv-action" href="https://github.com/DevinEldrian" target="_blank" rel="noopener noreferrer">VISIT GITHUB PROFILE ↗</a>
  </div>
}
export default function QuickView({onClose}){
  const [tab,setTab]=useState(initialTab)
  const panel=useRef(null),tabButtons=useRef([])
  useEffect(()=>{
    const restore=document.activeElement
    tabButtons.current[0]?.focus()
    function onKey(e){
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onClose();return}
      if(e.key==='Tab'){
        const focusables=Array.from(panel.current?.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')||[])
        if(focusables.length===0)return
        const first=focusables[0],last=focusables.at(-1)
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
      }
    }
    document.addEventListener('keydown',onKey,true)
    return()=>{document.removeEventListener('keydown',onKey,true);if(restore&&typeof restore.focus==='function')restore.focus()}
  },[onClose])
  function arrowKey(e,index){
    if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight'&&e.key!=='Home'&&e.key!=='End')return
    e.preventDefault()
    const idx=e.key==='Home'?0:e.key==='End'?SECTIONS.length-1:(index+(e.key==='ArrowRight'?1:-1)+SECTIONS.length)%SECTIONS.length
    setTab(SECTIONS[idx].id);tabButtons.current[idx]?.focus()
  }
  return <div className="qv-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <section className="qv-dialog" role="dialog" aria-modal="true" aria-labelledby="qv-title" ref={panel}>
      <header className="qv-header"><div><span className="qv-mark">旅</span><div><p id="qv-title">DEVIN / QUICK VIEW</p><small>PROFESSIONAL PORTFOLIO · NO 3D REQUIRED</small></div></div><button onClick={onClose} className="qv-close" aria-label="Close portfolio quick view">CLOSE ×</button></header>
      <div className="qv-columns">
        <nav className="qv-tabs" aria-label="Portfolio sections" role="tablist">{SECTIONS.map((s,i)=><button
          key={s.id} ref={el=>{tabButtons.current[i]=el}}
          id={'qv-tab-'+s.id} role="tab" aria-selected={tab===s.id} tabIndex={tab===s.id?0:-1}
          aria-controls="qv-tabpanel" onKeyDown={e=>arrowKey(e,i)} onClick={()=>setTab(s.id)}>
          <span>0{i+1}</span>{s.label}<span className="qv-arrow">↗</span>
        </button>)}</nav>
        <div className="qv-content" id="qv-tabpanel" role="tabpanel" tabIndex={0} aria-labelledby={'qv-tab-'+tab} key={tab}>
          <SectionContent tab={tab}/>
        </div>
      </div>
      <footer className="qv-footer"><span>AN INTERACTIVE JOURNEY / KISEKI</span><span><kbd>ESC</kbd> TO RETURN</span></footer>
    </section>
  </div>
}
