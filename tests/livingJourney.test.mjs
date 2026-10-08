import test from 'node:test'
import assert from 'node:assert/strict'
import {RAIL_STAGES,RAIL_DURATIONS,nextRailStage,skipRailStage,railStageLabel} from '../src/livingJourney.js'
test('boarding through cabin and disembark follows ordered phases',()=>{
 let state=RAIL_STAGES[0],seen=[]
 while(state){seen.push(state);state=nextRailStage(state)}
 assert.deepEqual(seen,['boarding','window','reveal','exiting'])
 assert.ok(seen.every(s=>RAIL_DURATIONS[s]>=800))
})
test('skip never strands player inside the cabin',()=>{
 assert.equal(skipRailStage('boarding'),'reveal')
 assert.equal(skipRailStage('window'),'reveal')
 assert.equal(skipRailStage('reveal'),'exiting')
 assert.equal(nextRailStage(skipRailStage('window')),'exiting')
 assert.equal(nextRailStage('exiting'),'')
})
test('train phases have distinguishable accessible descriptions',()=>{
 assert.equal(new Set(RAIL_STAGES.map(railStageLabel)).size,4)
})
