import test from 'node:test'
import assert from 'node:assert/strict'
import {AVATAR_RADIUS,rect,circle,overlapsCircle,resolveWalk} from '../src/collisionLogic.js'

test('cannot cross shop wall even sprinting in a low-FPS frame',()=>{
 const wall=rect(4,0,1,15,'shop')
 const result=resolveWalk({x:0,z:0},{x:12,z:0},[wall])
 assert.ok(result.x<2.7,`crossed solid wall at x=${result.x}`)
 assert.equal(result.blocked,true)
})
test('slides along walls rather than freezing diagonal movement',()=>{
 const wall=rect(4,0,1,20)
 const result=resolveWalk({x:0,z:0},{x:9,z:9},[wall])
 assert.ok(result.x<4-AVATAR_RADIUS)
 assert.ok(result.z>6,`unable to slide past wall: ${result.z}`)
})
test('round NPC bodies cannot be walked through',()=>{
 const npc=circle(0,-3,1,'npc')
 const stop=resolveWalk({x:0,z:0},{x:0,z:-10},[npc])
 assert.ok(stop.z> -3+1+AVATAR_RADIUS-.03)
})
test('bridge corridor traversable while Katsura water blocks elsewhere',()=>{
 const west=rect(-51,74,88,36,'river-west')
 const east=rect(51,74,88,36,'river-east')
 const col=[west,east]
 const crossing=resolveWalk({x:0,z:51},{x:0,z:99},col)
 assert.ok(crossing.z>96)
 const swimming=resolveWalk({x:17,z:51},{x:17,z:99},col)
 assert.ok(swimming.z<56-AVATAR_RADIUS+.2)
})
test('stable at forbidden geometry edge, preserves finite pose on corrupt frame',()=>{
 const ob=[rect(1,0,1,9)]
 let player={x:-2,z:0}
 for(let i=0;i<400;i++){
  player=resolveWalk(player,{x:player.x+.9,z:player.z+.03},ob)
  assert.ok(Number.isFinite(player.x)&&Number.isFinite(player.z))
 }
 assert.ok(player.x<.5)
 assert.deepEqual(resolveWalk(player,{x:Infinity,z:NaN},ob),{...player,blocked:true})
})
test('circle/box overlap is exact within expected footprint',()=>{
 assert.equal(overlapsCircle({x:2,z:2},rect(0,0,2,2),.5),false)
 assert.equal(overlapsCircle({x:1.2,z:0},rect(0,0,2,2),.5),true)
 assert.equal(overlapsCircle({x:0,z:0},circle(0,0,1),.9),true)
})
