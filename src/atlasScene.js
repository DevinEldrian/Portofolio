import * as THREE from 'three'
import {materialPBR} from './pbrMaterials.js'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js'
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js'

const physical=(color,extra={})=>new THREE.MeshPhysicalMaterial({color,roughness:.65,metalness:.04,...extra})
const neon=(color,power=2)=>physical(color,{emissive:color,emissiveIntensity:power,metalness:.32,roughness:.23})
const v=(x,y,z)=>new THREE.Vector3(x,y,z)
const random=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
function mesh(group,geometry,material,x,y,z){
  const m=new THREE.Mesh(geometry,material)
  m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m
}
function box(g,x,y,z,w,h,d,material){return mesh(g,new THREE.BoxGeometry(w,h,d),material,x,y,z)}
function pillar(g,x,y,z,r,h,m){
  return mesh(g,new THREE.CylinderGeometry(r,r,h,10),m,x,y,z)
}
function island(g,x,z,radius,tint){
  const base=new THREE.Group();base.position.set(x,0,z);g.add(base)
  // Floating islands are only an *overview interface metaphor*, not fake maps.
  mesh(base,new THREE.CylinderGeometry(radius*.95,radius*.8,12,56,5),materialPBR('stucco',{color:tint}),0,-7,0)
  mesh(base,new THREE.CylinderGeometry(radius*1.01,radius*.95,4,56,1),materialPBR('agedWood',{color:'#454f4b'}),0,-1,0)
  mesh(base,new THREE.CylinderGeometry(radius,radius*.99,.4,56,1),materialPBR('pavement',{color:'#7e9777'}),0,1.25,0)
  return base
}
function tower(g,x,z,w,h,d,seed){
  const c=['#2e3547','#273043','#3b3e50','#434051'][seed%4]
  box(g,x,1.3+h/2,z,w,h,d,physical(c,{metalness:.38,roughness:.31}))
  const lit=neon(seed%3?'#f3c6a7':'#a8d2e9',.45)
  for(let yy=5;yy<h;yy+=3.9)for(let xx=-w*.38;xx<w*.42;xx+=2.2){
    if((seed+Math.floor(yy*xx))%6===0)continue
    box(g,x+xx,1.3+yy,z+d/2+.12,.88,1.6,.06,lit)
  }
  const edges=neon(['#e356a3','#5f81ee','#4ad7cb'][seed%3],2.3)
  box(g,x,2+h*.67,z+d/2+.23,w*.95,.2,.09,edges)
  box(g,x,2+h*.29,z+d/2+.23,w*.8,.16,.09,edges)
}
function pagoda(g,x,z,scale=1){
  const dark=materialPBR('agedWood'),roof=materialPBR('roofTile'),wall=materialPBR('stucco',{color:'#a98168'})
  box(g,x,2,z,11*scale,4*scale,10*scale,wall)
  for(let i=0;i<4;i++){
    const y=4+i*4.3
    box(g,x,y+1,z,(12-i*1.6)*scale,.65*scale,(11-i*1.5)*scale,roof)
    box(g,x,y+2.9,z,(8-i*1.1)*scale,3*scale,(7-i*1.1)*scale,dark)
    for(const side of [-1,1])box(g,x+side*(4-i*.5)*scale,y+2.4,z, .3*scale,3*scale,(7-i*.7)*scale,wall)
  }
  mesh(g,new THREE.ConeGeometry(2*scale,5*scale,8),roof,x,25*scale,z)
}
function torii(g,x,z,s=1){
  const vermillion=physical('#b7372f',{roughness:.55})
  for(const offset of [-4,4])box(g,x+offset*s,5*s,z,.85*s,10*s,.9*s,vermillion)
  box(g,x,10.1*s,z,11*s,1.1*s,1.5*s,vermillion)
  box(g,x,11.1*s,z,12*s,.33*s,1.9*s,materialPBR('roofTile'))
}
function bamboo(g,seed,n=90,extent=30){
  const r=random(seed),stem=materialPBR('bamboo'),leaf=physical('#356d52',{roughness:.88,side:THREE.DoubleSide})
  const geo=new THREE.CylinderGeometry(.15,.2,1,8)
  const trunks=new THREE.InstancedMesh(geo,stem,n)
  const top=new THREE.InstancedMesh(new THREE.ConeGeometry(.9,3,5),leaf,n)
  trunks.castShadow=true;top.castShadow=true
  const dummy=new THREE.Object3D()
  for(let i=0;i<n;i++){
    const x=(r()-.5)*extent,z=(r()-.5)*extent,h=8+r()*15
    dummy.position.set(x,1+h/2,z);dummy.scale.set(1,h,1);dummy.rotation.set(0,0,0);dummy.updateMatrix()
    trunks.setMatrixAt(i,dummy.matrix)
    dummy.scale.set(1+r()*.5,1+r()*.6,1)
    dummy.position.set(x,1+h+r(),z);dummy.rotation.z=(r()-.5)*.5;dummy.updateMatrix()
    top.setMatrixAt(i,dummy.matrix)
  }
  g.add(trunks,top)
}
function maples(g,seed,n=25,extent=60){
  const r=random(seed)
  const bark=materialPBR('agedWood')
  const tones=['#a94d36','#c16c3b','#df9250','#c24439','#d8b064'].map(c=>physical(c))
  for(let i=0;i<n;i++){
    const x=(r()-.5)*extent,z=(r()-.5)*extent,h=5+r()*7
    pillar(g,x,1+h*.44,z,.4,h*.88,bark)
    for(let k=0;k<3;k++)mesh(g,new THREE.DodecahedronGeometry(2.5+r()*1.6,1),tones[(i+k)%5],x+(r()-.5)*3,h+r()*3,z+(r()-.5)*3)
  }
}
function station(g){
  const stone=materialPBR('pavement'),roof=materialPBR('roofTile'),metal=materialPBR('bronze')
  box(g,0,3,0,34,4,26,stone)
  box(g,0,12,0,46,2.1,32,roof)
  for(let x=-18;x<=18;x+=9)for(const z of [-14,14])pillar(g,x,7,z,.5,10,metal)
  const glass=physical('#80aeb8',{transparent:true,opacity:.64,metalness:.35,roughness:.12})
  for(let x=-15;x<=15;x+=6)box(g,x,7,13.6,4.5,7,.19,glass)
  box(g,0,15.2,11.9,21,2.7,.4,neon('#f5c79c',.7))
  const sign=labelPlane('KISEKI CENTRAL STATION',24,2.5)
  sign.position.set(0,15.2,12.23);g.add(sign)
  box(g,0,.8,-21,17,1.4,25,materialPBR('asphalt'))
  for(let z=-28;z<-11;z+=4)box(g,0,1.54,z,17,.13,.5,stone)
}
function labelPlane(value,width,height){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=96
  const cx=canvas.getContext('2d')
  cx.fillStyle='#1a2535';cx.fillRect(0,0,768,96)
  cx.strokeStyle='#d1ac80';cx.lineWidth=5;cx.strokeRect(3,3,762,90)
  cx.fillStyle='#ffe6c5';cx.textAlign='center';cx.font='bold 35px sans-serif';cx.fillText(value,384,60)
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace
  return new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map,transparent:true,side:THREE.DoubleSide}))
}
function arcade(g){
  const randomNumber=random(456)
  const ground=materialPBR('asphalt')
  box(g,0,1.44,0,47,.3,58,ground)
  for(let i=0;i<17;i++){
    const x=(i%2?1:-1)*(8+randomNumber()*13),z=-26+(i/17)*52,h=15+randomNumber()*32
    tower(g,x,z,7+randomNumber()*5,h,6+randomNumber()*3,i)
    if(i%3===0){
      const sign=labelPlane(['ゲーム','ARCADE','GAME LAB','ELECTRIC'][i%4],9,2.2)
      sign.position.set(x,10,z+5.7);g.add(sign)
    }
  }
  // Scramble zebra crossings, camera-visible dense metropolitan crosswalk.
  const white=physical('#e5dfdc',{roughness:.52})
  for(let i=-7;i<8;i++)box(g,i*2,1.62,-4,1.05,.06,11,white)
  for(let i=-7;i<8;i++)box(g,0,1.62,i*1.6,11,.06,.85,white)
  const trainEmissive=neon('#e75f8b',2.0)
  for(let x=-25;x<25;x+=10)box(g,x,2.1,22,7,1.2,3,trainEmissive)
}
function river(g){
  const surface=physical('#437e91',{metalness:.43,roughness:.11,clearcoat:1})
  mesh(g,new THREE.PlaneGeometry(84,29,2,2),surface,0,1.48,0).rotation.x=-Math.PI/2
  const bridge=materialPBR('agedWood')
  box(g,0,3.1,0,68,1.2,6,bridge)
  for(let x=-32;x<=32;x+=7)for(const z of [-3.15,3.15]){
    pillar(g,x,4.3,z,.27,3,bridge)
    box(g,x,5.5,z,7,.25,.18,bridge)
  }
}
function makeTrain(g,curve){
  const train=new THREE.Group();g.add(train)
  const white=physical('#e2e5e4',{metalness:.55,roughness:.24})
  const crimson=neon('#e96657',1.25)
  box(train,0,2.2,0,7,3.9,13,white)
  box(train,0,3,0,7.18,.42,13,crimson)
  const glass=physical('#5e9aa7',{metalness:.63,roughness:.08,transparent:true,opacity:.78})
  for(const side of [-1,1])for(let zz=-5;zz<6;zz+=2.5){
    box(train,side*3.55,2.2,zz,.12,1.5,2.05,glass)
  }
  return (t)=>{
    const p=curve.getPoint(t),dir=curve.getTangent(t)
    train.position.copy(p);train.rotation.y=Math.atan2(dir.x,dir.z)
  }
}
/** Build the real WebGL miniature atlas used by the portfolio's landing page. */
export function createAtlas(container,{onSelect}={}){
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'})
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75))
  renderer.setSize(Math.max(1,container.clientWidth),Math.max(1,container.clientHeight),false)
  renderer.outputColorSpace=THREE.SRGBColorSpace
  renderer.toneMapping=THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure=1.09
  renderer.shadowMap.enabled=true
  renderer.shadowMap.type=THREE.PCFSoftShadowMap
  renderer.domElement.setAttribute('aria-hidden','true')
  container.appendChild(renderer.domElement)
  const scene=new THREE.Scene()
  scene.background=new THREE.Color('#253249')
  scene.fog=new THREE.FogExp2('#34455a',.003)
  const camera=new THREE.PerspectiveCamera(45,1,.1,750)
  const light=new THREE.HemisphereLight('#ffd7bd','#47617e',2.05);scene.add(light)
  const sun=new THREE.DirectionalLight('#ffb993',4)
  sun.position.set(-75,120,55);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048)
  Object.assign(sun.shadow.camera,{left:-180,right:180,top:180,bottom:-180});scene.add(sun)
  const ocean=mesh(scene,new THREE.PlaneGeometry(460,380),
    physical('#1e4b6b',{metalness:.67,roughness:.2,clearcoat:1}),0,-14,0)
  ocean.rotation.x=-Math.PI/2
  const world=new THREE.Group();scene.add(world)
  const hub=island(world,0,22,31,'#718c6c')
  station(hub)
  const tokyo=island(world,-89,-20,42,'#586d74')
  arcade(tokyo)
  const arashi=island(world,79,-38,40,'#678c6f')
  river(arashi)
  bamboo(arashi,71,105,61)
  const heritage=island(world,79,75,37,'#818963')
  pagoda(heritage,0,-5,.98)
  torii(heritage,20,11,.76)
  maples(heritage,34,21,56)
  const snow=island(world,-17,-100,26,'#8f9b9e')
  const mt=new THREE.Mesh(new THREE.ConeGeometry(23,65,36),physical('#8795a5',{roughness:1}))
  mt.position.set(0,33,0);snow.add(mt)
  const cap=new THREE.Mesh(new THREE.ConeGeometry(10,24,36),physical('#f1eeea',{roughness:.82}))
  cap.position.set(0,57,0);snow.add(cap)
  const routePoints=[
    v(-87,4,-20),v(-63,8,-18),v(-31,8,10),v(0,8,21),
    v(40,8,9),v(73,8,-38),v(102,8,-10),v(90,8,50),v(79,8,75)
  ]
  const path=new THREE.CatmullRomCurve3(routePoints,false,'catmullrom',.2)
  mesh(world,new THREE.TubeGeometry(path,240,.9,10,false),materialPBR('bronze',{color:'#8e9296',metalness:.82}),0,0,0)
  const redTrack=mesh(world,new THREE.TubeGeometry(path,240,.29,7,false),neon('#ea7977',3),0,.42,0)
  redTrack.material.depthWrite=true
  const animateTrain=makeTrain(world,path)
  const composer=new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene,camera))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(Math.max(1,container.clientWidth),Math.max(1,container.clientHeight)),.45,.52,.84))
  composer.addPass(new OutputPass())
  const zones=[
    {x:-89,z:-20,id:'akihabara'}, {x:79,z:-38,id:'arashiyama'},
    {x:79,z:75,id:'kyoto'}, {x:0,z:22,id:'arashiyama'}
  ]
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2()
  function click(e){
    const rect=renderer.domElement.getBoundingClientRect()
    pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1)
    raycaster.setFromCamera(pointer,camera)
    const hits=raycaster.intersectObjects([hub,tokyo,arashi,heritage],true)
    if(!hits.length)return
    const near=zones.reduce((best,z)=>{
      const cx=hits[0].point.x,cz=hits[0].point.z,d=Math.hypot(cx-z.x,cz-z.z)
      return d<best.distance?{id:z.id,distance:d}:best
    },{id:'arashiyama',distance:Infinity})
    onSelect?.(near.id)
  }
  renderer.domElement.addEventListener('click',click)
  let raf=0,stopped=false,last=performance.now(),time=0
  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  function resize(){
    const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight)
    renderer.setSize(w,h,false);composer.setSize(w,h)
    camera.aspect=w/h;camera.updateProjectionMatrix()
  }
  const ro=new ResizeObserver(resize);ro.observe(container)
  function frame(now){
    if(stopped)return
    raf=requestAnimationFrame(frame)
    const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now
    time+=dt
    camera.position.set(0+(!reduce?Math.sin(time*.045)*3:0),119,244)
    camera.lookAt(0,3,4)
    animateTrain(reduce?.21:(time*.024)%1)
    composer.render()
  }
  resize();frame(performance.now())
  return ()=>{
    stopped=true;cancelAnimationFrame(raf);ro.disconnect()
    renderer.domElement.removeEventListener('click',click)
    composer.dispose()
    // procedural shared PBR material maps are intentionally retained for game zone.
    scene.traverse(o=>{
      if(!o.isMesh&&!o.isInstancedMesh)return
      o.geometry?.dispose()
      if(!o.material?.userData?.persistentPBR)o.material?.dispose()
    })
    renderer.dispose()
    renderer.domElement.remove()
  }
}
