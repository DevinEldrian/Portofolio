/** Surface height for the walkable Kyoto bridge, with eased public ramps. */
const ramp=(v,a,b)=>Math.max(0,Math.min(1,(v-a)/(b-a)))
export function walkSurfaceY(region,point){
 if(region!=='kyoto'||!Number.isFinite(point?.x)||!Number.isFinite(point?.z))return .13
 // Raised bridge deck with gentle approaches at the north/south landings.
 const x=Math.max(0,Math.min(1,(6.3-Math.abs(point.x))/1.4))
 const north=ramp(point.z,43,51),south=1-ramp(point.z,96,104)
 return .13+.7*Math.max(0,Math.min(x,north,south))
}
