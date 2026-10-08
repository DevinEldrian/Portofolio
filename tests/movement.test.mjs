import test from 'node:test'
import assert from 'node:assert/strict'
import {move,nearStation,LIMIT} from '../src/gameLogic.js'
import {LOCATIONS,nextLocation} from '../src/locations.js'
test('W moves forward without invalid coordinates',()=>{
  const pos=move({x:0,z:12},new Set(['w']),1/60)
  assert.ok(pos.z<12 && Number.isFinite(pos.z))
})
test('clamped delta and world bounds prevent teleporting',()=>{
  const pos=move({x:LIMIT,z:-LIMIT},new Set(['w','d']),120)
  assert.equal(pos.x,LIMIT); assert.equal(pos.z,-LIMIT)
})
test('near station interaction',()=>{
  assert.equal(nearStation({x:20,z:-12},{x:20,z:-10}),true)
  assert.equal(nearStation({x:0,z:0},{x:20,z:-10}),false)
})
test('all sections have distinct regions and train route loops',()=>{
  assert.equal(new Set(LOCATIONS.map(x=>x.id)).size,4)
  assert.equal(nextLocation('kamakura').id,'kyoto')
})
