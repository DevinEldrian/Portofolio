import test from 'node:test'
import assert from 'node:assert/strict'
import {HOTSPOTS,P0_KIOSKS,getHotspot} from '../src/portfolioContent.js'
test('P0 has at least 2 meaningful kiosks placed in neutral spaces',()=>{
  assert.ok(P0_KIOSKS.length>=2)
  assert.ok(P0_KIOSKS.every(p=>p.anchor.includes('neutral')))
})
test('every CV hotspot has visible evidence and complete readable narrative',()=>{
  const ids=new Set()
  for(const p of HOTSPOTS){
    assert.ok(!ids.has(p.id))
    ids.add(p.id)
    assert.ok(p.teaser.length>20 && p.story.length>50 && p.evidence.length>=2)
    assert.equal(getHotspot(p.id)?.label,p.label)
    assert.ok(!('coordinates' in p))
  }
  assert.equal(getHotspot('missing'),null)
})
