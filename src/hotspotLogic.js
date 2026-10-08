// Provisional game coordinates; final alignment follows X1 geography blockout.
export const HOTSPOT_POSITIONS=Object.freeze({
  'street-eclaim':Object.freeze({x:-5,z:14}),
  'riverside-treasury':Object.freeze({x:-8,z:50}),
  'forest-values':Object.freeze({x:7,z:-75})
})
export function nearestHotspot(player,radius=8){
  if(!Number.isFinite(player?.x)||!Number.isFinite(player?.z)||!Number.isFinite(radius)||radius<=0)return null
  let best=null,dist=radius
  for(const [id,p] of Object.entries(HOTSPOT_POSITIONS)){
    const d=Math.hypot(p.x-player.x,p.z-player.z)
    if(d<=dist){best=id;dist=d}
  }
  return best
}
