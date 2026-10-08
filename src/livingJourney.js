// DOM timeline and WebGL visual phases share the same deterministic progression.
// A fictional scenic sequence, not a claim of a direct Randen service to Tokyo.
export const RAIL_STAGES=Object.freeze(['boarding','window','reveal','exiting'])
export const RAIL_DURATIONS=Object.freeze({boarding:1800,window:3100,reveal:900,exiting:1750})
export function nextRailStage(current){
 const i=RAIL_STAGES.indexOf(current)
 return i<0?'':(RAIL_STAGES[i+1]||'')
}
export function skipRailStage(current){
 if(current==='boarding'||current==='window')return 'reveal'
 if(current==='reveal')return 'exiting'
 return current
}
export function railStageLabel(stage){
 return ({boarding:'Avatar boarding the Randen-inspired tram',
 window:'Inside the cabin · Scenery passing the windows',
 reveal:'Arriving at the next platform',
 exiting:'Doors open · Avatar disembarking'})[stage]||'Exploring'
}
