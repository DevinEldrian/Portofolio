import test from 'node:test'
import assert from 'node:assert/strict'
import {initialJourney,nextJourneyState,PHASES,transferLabel,isTravelling} from '../src/trainJourney.js'
const next=(s,type,props={})=>nextJourneyState(s,{type,...props})
test('avatar approaches platform, selects route, boards, travels and exits',()=>{
  let s=initialJourney()
  s=next(s,'APPROACH_STATION');assert.equal(s.phase,PHASES.APPROACH)
  s=next(s,'OPEN_ROUTE_MAP');assert.equal(s.phase,PHASES.ROUTE_SELECT)
  assert.equal(next(s,'BOARD').phase,PHASES.ROUTE_SELECT)
  s=next(s,'CHOOSE_DESTINATION',{destination:'arashiyama'})
  s=next(s,'BOARD');assert.equal(s.phase,PHASES.BOARDING)
  s=next(s,'AVATAR_ENTERED');assert.equal(s.phase,PHASES.WINDOW)
  assert.equal(isTravelling(s),true)
  s=next(s,'ARRIVED');assert.equal(s.phase,PHASES.REVEAL)
  s=next(s,'DISEMBARK');assert.equal(s.phase,PHASES.EXITING)
  s=next(s,'AVATAR_EXITED')
  assert.deepEqual(s,initialJourney())
})
test('skip always reaches arrival without losing destination',()=>{
  for(const phase of [PHASES.BOARDING,PHASES.WINDOW]){
    const s=next({phase,destination:'koyasan',skipped:false,error:null},'SKIP')
    assert.equal(s.phase,PHASES.REVEAL)
    assert.equal(s.destination,'koyasan')
    assert.equal(s.skipped,true)
  }
})
test('ESC cancels selection and no train remains stuck after failure',()=>{
  let s=next(next(initialJourney(),'APPROACH_STATION'),'OPEN_ROUTE_MAP')
  assert.deepEqual(next(s,'ESC'),initialJourney())
  s=next({phase:PHASES.WINDOW,destination:'tokyo',skipped:false,error:null},'ERROR',{message:'WebGL context lost'})
  assert.equal(s.phase,PHASES.EXPLORE);assert.match(s.error,/WebGL/)
})
test('invalid events and missing state never start unintended travel',()=>{
  assert.deepEqual(nextJourneyState(null,{type:'BOARD'}),initialJourney())
  assert.equal(next(initialJourney(),'BOARD').phase,PHASES.EXPLORE)
  assert.match(transferLabel('ginzan'),/road/)
  assert.match(transferLabel('koyasan'),/cable-car/)
  assert.match(transferLabel('miyajima'),/ferry/)
})
