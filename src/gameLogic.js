export const LIMIT = 260
export const clamp = (x,min,max) => Number.isFinite(x)?Math.max(min,Math.min(max,x)):min
export const sanitizePosition = pos => ({x: Number.isFinite(pos?.x)?clamp(pos.x,-LIMIT,LIMIT):0,z: Number.isFinite(pos?.z)?clamp(pos.z,-LIMIT,LIMIT):0})
export function move(position,keys,dt){
  const safe=sanitizePosition(position)
  const x=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'))
  const z=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'))
  const len=Math.hypot(x,z)
  const delta=clamp(Number.isFinite(dt)?dt:0,0,0.05)
  const speed=keys.has('shift')?6.5:3.1
  return {
    x:clamp(safe.x+(len?x/len:0)*speed*delta,-LIMIT,LIMIT),
    z:clamp(safe.z+(len?z/len:0)*speed*delta,-LIMIT,LIMIT),
    moving:len>0,
    heading:len?Math.atan2(x,z):null
  }
}
export function nearStation(player,station,radius=12){
  const p=sanitizePosition(player)
  return Number.isFinite(station?.x)&&Number.isFinite(station?.z)&&Math.hypot(p.x-station.x,p.z-station.z)<=radius
}
