import test from 'node:test'
import assert from 'node:assert/strict'
import {HOTSPOT_POSITIONS,nearestHotspot} from '../src/hotspotLogic.js'
import {getHotspot} from '../src/portfolioContent.js'
test('each interactive marker links to a substantive CV chapter',()=>{
 for(const id of Object.keys(HOTSPOT_POSITIONS)){
  const story=getHotspot(id)
  assert.ok(story,id)
  assert.ok(story.story.length>60)
  assert.ok(story.evidence.length>1)
 }
})
test('nearby kiosk targeting is spatially constrained',()=>{
 for(const [id,pos] of Object.entries(HOTSPOT_POSITIONS)){
  assert.equal(nearestHotspot(pos),id)
 }
 assert.equal(nearestHotspot({x:80,z:80}),null)
})
test('invalid coordinates cannot activate hotspots',()=>{
 assert.equal(nearestHotspot({x:NaN,z:0}),null)
 assert.equal(nearestHotspot({x:Infinity,z:0}),null)
 assert.equal(nearestHotspot({x:0,z:0},NaN),null)
 assert.equal(nearestHotspot(null),null)
})
