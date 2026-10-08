/**
 * Third-person camera state kept independent of WebGL so broken input cannot
 * propagate NaN/Infinity into the Three.js view/projection matrix.
 * Coordinates are game-local, not surveyed geographic coordinates.
 */
export const CAMERA_DEFAULTS=Object.freeze({yaw:0.55,pitch:0.37,distance:7.4})
const MIN_PITCH=0.18,MAX_PITCH=1.12,MIN_DISTANCE=3.5,MAX_DISTANCE=17
const finite=(value,fallback)=>Number.isFinite(value)?value:fallback
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value))

export function safeCameraState(raw){
  const yaw=finite(raw?.yaw,CAMERA_DEFAULTS.yaw)
  return {
    yaw:Math.atan2(Math.sin(yaw),Math.cos(yaw)),
    pitch:clamp(finite(raw?.pitch,CAMERA_DEFAULTS.pitch),MIN_PITCH,MAX_PITCH),
    distance:clamp(finite(raw?.distance,CAMERA_DEFAULTS.distance),MIN_DISTANCE,MAX_DISTANCE)
  }
}

export function cameraAfterInput(raw,{yaw=0,pitch=0,zoom=0}={}){
  const s=safeCameraState(raw)
  // Reject corrupt or extreme input rather than letting it poison camera pose.
  const dy=clamp(finite(yaw,0),-Math.PI,Math.PI)
  const dp=clamp(finite(pitch,0),-0.7,0.7)
  const dz=clamp(finite(zoom,0),-12,12)
  return safeCameraState({yaw:s.yaw+dy,pitch:s.pitch+dp,distance:s.distance+dz})
}

export function cameraPose(rawTarget,rawState){
  const s=safeCameraState(rawState)
  const target={
    x:finite(rawTarget?.x,0),
    y:finite(rawTarget?.y,3),
    z:finite(rawTarget?.z,0)
  }
  const horizontal=Math.cos(s.pitch)*s.distance
  return {
    target,
    position:{
      x:target.x+Math.sin(s.yaw)*horizontal,
      y:Math.max(1.35,target.y+Math.sin(s.pitch)*s.distance),
      z:target.z+Math.cos(s.yaw)*horizontal
    }
  }
}
