import * as THREE from 'three'

const solid=(color)=>new THREE.MeshStandardMaterial({color,roughness:.78,metalness:.06})
function block(g,x,y,z,w,h,d,color){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),solid(color))
  mesh.position.set(x,y,z);mesh.castShadow=true;g.add(mesh);return mesh
}
/**
 * A small in-world cinematic diorama; no pretending the old 1.1s fade is travel.
 * Steps are driven by the UI: BOARDING -> WINDOW -> REVEAL -> EXITING.
 * Randen does NOT claim to connect directly to Tokyo: this trip is stylized.
 */
export function createRailCinematic(scene){
  const cabin=new THREE.Group()
  cabin.position.set(0,0,190)
  cabin.name='visible train cabin and window vista'
  scene.add(cabin)
  cabin.visible=false
  block(cabin,0,.36,0,13,.7,19,'#6d5351')
  block(cabin,0,8.6,0,13,.5,19,'#e7e1ce')
  for(const x of [-6.35,6.35]){
    block(cabin,x,2.1,0,.2,3.6,19,'#644b67')
    block(cabin,x,7.3,0,.35,2.2,19,'#675068')
    for(const z of [-8,-3,2,7])block(cabin,x,4.55,z,.45,5.2,.45,'#bda58d')
    for(const z of [-5,0,5])block(cabin,x-Math.sign(x)*1.45,1.65,z,2.1,.8,3,'#708284')
  }
  for(const z of [-7.5,7.5]){
    block(cabin,0,4.8,z,12,7,.2,'#ddd4c5')
    block(cabin,0,3.1,z-Math.sign(z)*.15,3,4.3,.24,'#856f7e')
  }
  // Door aperture, grab rails, luggage rack and seat backs visible to the camera.
  for(const x of [-2,2]){
    block(cabin,x,4.2,-5,.12,6.6,.12,'#d5c1a7')
    block(cabin,x,4.2,5,.12,6.6,.12,'#d5c1a7')
  }
  for(const z of [-4,2]){
    block(cabin,-4,2.7,z,.5,2,3.2,'#7a6565')
    block(cabin,4,2.7,z,.5,2,3.2,'#7a6565')
  }
  const scenery=new THREE.Group()
  cabin.add(scenery)
  for(let i=0;i<11;i++){
    const z=-18+i*5.6
    // Golden-hour foothills visible through the windows.
    const hill=new THREE.Mesh(new THREE.ConeGeometry(3.2+(i%3),13+(i%5),6),solid(i%2?'#6e886e':'#8c946d'))
    hill.position.set(-23,2,z);scenery.add(hill)
    const other=hill.clone();other.position.x=23;scenery.add(other)
  }
  let phase='',progress=0
  return {
    setPhase(next){
      phase=next||'';progress=0
      cabin.visible=phase==='window'
    },
    update(dt,now,camera,person,{reducedMotion=false}={}){
      if(!phase)return false
      progress=Math.min(1,progress+dt/(phase==='window'?3.2:1.65))
      const e=progress*progress*(3-2*progress)
      cabin.visible=phase==='window'
      if(phase==='boarding'){
        person.g.position.set(31+14*e,.12,-9)
        person.g.rotation.y=Math.PI/2
        person.legA.rotation.x=Math.sin(now*.014)*.5
        person.legB.rotation.x=-person.legA.rotation.x
        camera.position.set(25,12,6)
        camera.lookAt(41,3,-10)
      }else if(phase==='window'){
        person.g.position.set(-.1,.5,190)
        person.g.rotation.y=-.35
        person.legA.rotation.x=0
        person.legB.rotation.x=0
        camera.position.set(5.4,6,201.5)
        camera.lookAt(-.8,3.3,190)
        if(!reducedMotion)scenery.position.z=Math.sin(now*.0007)*2.4
      }else if(phase==='reveal'){
        person.g.position.set(45,.12,-10)
        camera.position.set(27,11,5)
        camera.lookAt(43,3,-10)
      }else if(phase==='exiting'){
        person.g.position.set(45-13*e,.12,-10+13*e)
        person.g.rotation.y=-Math.PI*.68
        person.legA.rotation.x=Math.sin(now*.013)*.5
        person.legB.rotation.x=-person.legA.rotation.x
        camera.position.set(26,12,6)
        camera.lookAt(39,3,-7)
      }
      camera.updateMatrixWorld()
      return true
    },
    dispose(){
      cabin.traverse(c=>{
        if(!c.isMesh)return
        c.geometry?.dispose()
        if(Array.isArray(c.material))c.material.forEach(m=>m.dispose())
        else c.material?.dispose()
      })
      scene.remove(cabin)
    }
  }
}
