import test from 'node:test'
import assert from 'node:assert/strict'
import {HOTSPOT_POSITIONS,nearestHotspot} from '../src/hotspotLogic.js'

test('Arashiyama story markers follow the playable Kyoto route',()=>{
 const street=HOTSPOT_POSITIONS['street-eclaim']
 const river=HOTSPOT_POSITIONS['riverside-treasury']
 const grove=HOTSPOT_POSITIONS['forest-values']
 assert.ok(street.z>=0 && street.z<45,'E-Claim must sit on the shopping street')
 assert.ok(river.z>=45 && river.z<=60,'Treasury must sit at the north Katsura promenade')
 assert.ok(grove.z<=-60 && grove.z>=-94,'Reflection must sit near Sagano bamboo')
 for(const [id,position] of Object.entries(HOTSPOT_POSITIONS)){
  assert.ok(Math.abs(position.x)<=95 && Math.abs(position.z)<=95)
  assert.equal(nearestHotspot(position),id)
 }
})
