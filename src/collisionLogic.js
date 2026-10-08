/**
 * Lightweight continuous 2D avatar collision used by the walking world.
 * Ground-based footprints are rectangles or cylinders, not a mesh raycaster.
 * Step splitting prevents sprinting through thin walls at low frame rates.
 */
import {LIMIT} from './gameLogic.js'
export const AVATAR_RADIUS=0.38
const isFinitePoint=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z)
const cl=(x,a,b)=>Math.max(a,Math.min(b,x))
export const rect=(x,z,w,d,id='structure')=>Object.freeze({shape:'rect',x,z,w,d,id})
export const circle=(x,z,r,id='person')=>Object.freeze({shape:'circle',x,z,r,id})
export function overlapsCircle(point,obstacle,radius=AVATAR_RADIUS){
  if(!isFinitePoint(point)||!obstacle||!Number.isFinite(radius)||radius<0)return false
  if(obstacle.shape==='circle'){
    if(!isFinitePoint(obstacle)||!Number.isFinite(obstacle.r)||obstacle.r<0)return false
    return Math.hypot(point.x-obstacle.x,point.z-obstacle.z)<radius+obstacle.r-1e-7
  }
  if(obstacle.shape==='rect'){
    if(!isFinitePoint(obstacle)||!Number.isFinite(obstacle.w)||!Number.isFinite(obstacle.d)||obstacle.w<=0||obstacle.d<=0)return false
    const halfW=obstacle.w/2,halfD=obstacle.d/2
    const nearestX=cl(point.x,obstacle.x-halfW,obstacle.x+halfW)
    const nearestZ=cl(point.z,obstacle.z-halfD,obstacle.z+halfD)
    return (point.x-nearestX)**2+(point.z-nearestZ)**2<radius*radius-1e-7
  }
  return false
}
export function blocked(point,obstacles=[],radius=AVATAR_RADIUS){
  return obstacles.some(o=>overlapsCircle(point,o,radius))
}
/**
 * Resolve proposed motion with substeps and X/Z axis sliding. Bounds and
 * collision are evaluated after each partial axis movement. A bad/NaN
 * destination cannot poison the render position or camera.
 */
export function resolveWalk(from,to,obstacles=[],{
  radius=AVATAR_RADIUS, limit=LIMIT,maxStep=.28
}={}){
  if(!isFinitePoint(from))return {x:0,z:0,blocked:true}
  if(!isFinitePoint(to))return {x:from.x,z:from.z,blocked:true}
  const r=Number.isFinite(radius)&&radius>=0?radius:AVATAR_RADIUS
  const l=Number.isFinite(limit)&&limit>r?limit:LIMIT
  const step=Number.isFinite(maxStep)&&maxStep>.02?Math.min(maxStep,1):.28
  const tx=cl(to.x,-l,l),tz=cl(to.z,-l,l)
  const dx=tx-from.x,dz=tz-from.z
  const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/step))
  let x=cl(from.x,-l,l),z=cl(from.z,-l,l),hit=false
  for(let i=0;i<n;i++){
    const nx=cl(x+dx/n,-l,l)
    if(!blocked({x:nx,z},obstacles,r))x=nx
    else hit=true
    const nz=cl(z+dz/n,-l,l)
    if(!blocked({x,z:nz},obstacles,r))z=nz
    else hit=true
  }
  return {x,z,blocked:hit}
}
