import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'

/**
 * CC0 Quaternius humanoid with a REAL rig, skinning, mesh topology and
 * authored animation clips. Imported to /public/models by audited workflow.
 * The handmade traveler is used only as an offline/404 fallback.
 */
const MODEL='/models/quaternius-human-cc0.glb'
const matchClip=(clips,terms)=>clips.find(c=>terms.some(w=>c.name.toLowerCase().includes(w)))
export function enableRiggedTraveler(person,{onStatus}={}){
  let disposed=false,mixer=null,active=null,actions={},loaded=null
  const fallback=[...person.g.children]
  const setStatus=x=>{person.g.userData.characterStatus=x;onStatus?.(x)}
  setStatus('loading-rig')
  const loader=new GLTFLoader()
  loader.load(MODEL,gltf=>{
    if(disposed)return
    const model=gltf.scene
    model.updateMatrixWorld(true)
    const bb=new THREE.Box3().setFromObject(model)
    const size=bb.getSize(new THREE.Vector3())
    if(!Number.isFinite(size.y)||size.y<=.01){setStatus('invalid-rig');return}
    const s=1.75/size.y
    const center=bb.getCenter(new THREE.Vector3())
    model.scale.multiplyScalar(s)
    model.position.set(-center.x*s,-bb.min.y*s,-center.z*s)
    model.traverse(n=>{
      if(n.isMesh||n.isSkinnedMesh){
        n.castShadow=true;n.receiveShadow=true
        n.frustumCulled=false
        if(n.material){n.material.side=THREE.FrontSide;n.material.needsUpdate=true}
      }
    })
    person.g.add(model)
    for(const child of fallback)child.visible=false
    loaded=model
    mixer=new THREE.AnimationMixer(model)
    const clips=gltf.animations||[]
    const modes={
      idle:matchClip(clips,['idle','stand','breath']),
      walk:matchClip(clips,['walk','walking','movement']),
      run:matchClip(clips,['run','running','sprint'])
    }
    for(const [name,clip] of Object.entries(modes))if(clip)actions[name]=mixer.clipAction(clip)
    // Unsupported clips never override the fallback; missing walk animation
    // is reported clearly for Bos and the QA evidence.
    active=actions.idle||actions.walk||actions.run||null
    active?.play()
    setStatus(Object.keys(actions).length>=2?'rigged-animated':'rigged-no-walk-clip')
  },undefined,()=>{
    if(!disposed)setStatus('offline-model-fallback')
  })
  return {
    update(dt,{moving=false,running=false}={}){
      if(disposed||!loaded||!mixer)return
      const target=(!moving?actions.idle:running?actions.run||actions.walk:actions.walk)||actions.idle||active
      if(target&&target!==active){
        active?.fadeOut(.2)
        target.reset().fadeIn(.2).play()
        active=target
      }
      mixer.update(Math.min(.05,Math.max(0,dt)))
    },
    status:()=>person.g.userData.characterStatus,
    dispose(){disposed=true;mixer?.stopAllAction();if(loaded)person.g.remove(loaded)}
  }
}
