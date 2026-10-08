export const LIMIT = 95
export const clamp = (x,min,max) => Math.max(min,Math.min(max,x))
export function move(position,keys,dt){
  const x=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'))
  const z=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'))
  const len=Math.hypot(x,z)
  const delta=clamp(Number.isFinite(dt)?dt:0,0,0.05)
  const speed=keys.has('shift')?21:13
  return {
    x:clamp(position.x+(len?x/len:0)*speed*delta,-LIMIT,LIMIT),
    z:clamp(position.z+(len?z/len:0)*speed*delta,-LIMIT,LIMIT),
    moving:len>0,
    heading:len?Math.atan2(x,z):null
  }
}
export function nearStation(player,station,radius=12){
  return Math.hypot(player.x-station.x,player.z-station.z)<=radius
}
