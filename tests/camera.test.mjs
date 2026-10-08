import test from 'node:test'
import assert from 'node:assert/strict'
import {CAMERA_DEFAULTS,safeCameraState,cameraAfterInput,cameraPose} from '../src/cameraLogic.js'

test('camera follows avatar and always returns finite positions',()=>{
 const a=cameraPose({x:0,y:3,z:0},CAMERA_DEFAULTS)
 const b=cameraPose({x:10,y:3,z:-20},CAMERA_DEFAULTS)
 assert.ok(Object.values(a.position).every(Number.isFinite))
 assert.ok(Object.values(b.position).every(Number.isFinite))
 assert.ok(Math.abs((b.position.x-a.position.x)-10)<1e-9)
 assert.ok(Math.abs((b.position.z-a.position.z)+20)<1e-9)
})
test('corrupt input is sanitized before camera pose calculation',()=>{
 for(const state of [{yaw:NaN,pitch:Infinity,distance:-Infinity},null]){
  const s=safeCameraState(state)
  const p=cameraPose({x:NaN,y:Infinity,z:-Infinity},s)
  assert.ok(Object.values(s).every(Number.isFinite))
  assert.ok(Object.values(p.position).every(Number.isFinite))
 }
})
test('orbit drag and zoom clamp to safe bounds',()=>{
 const s=cameraAfterInput(CAMERA_DEFAULTS,{yaw:Infinity,pitch:1e300,zoom:-1e300})
 assert.ok(Object.values(s).every(Number.isFinite))
 assert.ok(s.distance>=7&&s.distance<=38)
 assert.ok(s.pitch>=0.18&&s.pitch<=1.12)
 assert.equal(cameraAfterInput(CAMERA_DEFAULTS,{zoom:-4}).distance,20)
})
test('camera position remains above terrain',()=>{
 assert.ok(cameraPose({x:0,y:-500,z:0},{yaw:0,pitch:0,distance:7}).position.y>=2.5)
})
