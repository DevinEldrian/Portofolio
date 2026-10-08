import test from 'node:test'
import assert from 'node:assert/strict'
import {walkSurfaceY} from '../src/terrainLogic.js'
test('bridge lifts feet over river and returns to level bank',()=>{
 assert.ok(walkSurfaceY('arashiyama',{x:0,z:73})>.8)
 assert.equal(walkSurfaceY('arashiyama',{x:0,z:40}),.13)
 assert.equal(walkSurfaceY('arashiyama',{x:0,z:105}),.13)
 assert.ok(walkSurfaceY('arashiyama',{x:0,z:48})>.13)
})
test('scenery outside bridge stays on ground; corrupt coordinates remain safe',()=>{
 assert.equal(walkSurfaceY('arashiyama',{x:20,z:73}),.13)
 assert.equal(walkSurfaceY('akihabara',{x:0,z:73}),.13)
 assert.equal(walkSurfaceY('arashiyama',{x:Infinity,z:NaN}),.13)
})
