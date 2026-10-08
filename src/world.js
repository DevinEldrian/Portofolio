import * as THREE from 'three'
import {locationById} from './locations.js'
import {move,nearStation} from './gameLogic.js'

const STATION={x:20,z:-10}
const EMPTY_KEYS=new Set()
const mat=(c,extra={})=>new THREE.MeshStandardMaterial({color:c,roughness:.85,...extra})
const vector=(x,y,z)=>new THREE.Vector3(x,y,z)
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
function block(g,x,y,z,w,h,d,color){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof color==='string'?mat(color):color)
  mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh
}
function ground(g,x,z,w,d,color,y=.01){
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(color))
  mesh.rotation.x=-Math.PI/2;mesh.position.set(x,y,z);mesh.receiveShadow=true;g.add(mesh);return mesh
}
function ball(g,x,y,z,r,color){
  const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),mat(color))
  mesh.position.set(x,y,z);mesh.castShadow=true;g.add(mesh)
}
function cylinder(g,x,y,z,r1,r2,h,color){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,h,7),mat(color))
  mesh.position.set(x,y,z);mesh.castShadow=true;g.add(mesh);return mesh
}
function mountain(g,x,z,h,color){
  const mesh=new THREE.Mesh(new THREE.ConeGeometry(h*.88,h,6),mat(color))
  mesh.position.set(x,h*.43,z);mesh.castShadow=true;g.add(mesh)
}
function tree(g,x,z,style,r){
  let tall=style==='pine'?5+r()*2.5:4+r()*2
  cylinder(g,x,tall*.5,z,.37,.25,tall,'#795e50')
  if(style==='pine'){
    for(let i=0;i<3;i++){
      const mesh=new THREE.Mesh(new THREE.ConeGeometry(3.2-i*.42,5.4-i*.45,7),mat(i%2?'#3f7564':'#2f5c4f'))
      mesh.position.set(x,tall+2.1-i*1.6,z);mesh.castShadow=true;g.add(mesh)
    }
  } else {
    const colors=style==='sakura'?['#efb2ba','#f3ced2','#f6d9d9','#e8a7b3']:['#5e8c76','#83aa85','#6e9879']
    for(let i=0;i<4;i++)ball(g,x+(r()-.5)*3,tall+r()*2+1,z+(r()-.5)*3,2+r()*.7,colors[i%colors.length])
  }
}
function torii(g,z,scale=1){
  const red='#bb4e40',dark='#353a38'
  block(g,-4*scale,4.5*scale,z,.9*scale,9*scale,.9*scale,red)
  block(g,4*scale,4.5*scale,z,.9*scale,9*scale,.9*scale,red)
  block(g,0,9.1*scale,z,11*scale,1.1*scale,1.15*scale,red)
  block(g,0,9.8*scale,z,12*scale,.38*scale,1.2*scale,dark)
  block(g,0,7.1*scale,z,8.8*scale,.43*scale,.7*scale,red)
}
function house(g,x,z,c='#a89a81',roof='#444849'){
  block(g,x,3.3,z,12,6.6,9,c);block(g,x,7.1,z,13.5,1.1,10.3,roof)
  for(let i=-1;i<=1;i++){
    block(g,x+i*3.5,3.7,z+4.58,2.8,3.4,.22,'#735e50')
    block(g,x+i*3.5,4,z+4.73,2.15,2.3,.18,mat('#e7d8ba',{emissive:'#e7be86',emissiveIntensity:.15}))
  }
}
function lightPost(g,x,z,c='#d98170'){
  cylinder(g,x,2.8,z,.1,.1,5.6,'#3c4946')
  block(g,x,5.2,z,1,1.15,1,c)
  block(g,x,5.89,z,1.4,.25,1.4,'#333f41')
}
function textBoard(g,place){
  const c=document.createElement('canvas');c.width=512;c.height=200
  const a=c.getContext('2d')
  a.fillStyle='#f0eadc';a.fillRect(0,0,512,200)
  a.fillStyle='#2c4545';a.textAlign='center'
  a.font='bold 62px Arial';a.fillText('STATION',256,97)
  a.font='28px Arial';a.fillText(place.city+' LINE',256,148)
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(8.4,3.1),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}))
  mesh.position.set(STATION.x,9.4,STATION.z+6.15);g.add(mesh)
}
function addStation(g,place){
  const {x,z}=STATION
  ground(g,x,z,28,18,'#b5ac9b',.14)
  block(g,x,3.3,z,22,6.6,12,'#e4ddcd')
  block(g,x,7.4,z,25,1.45,14,'#35494b')
  block(g,x,6.78,z+7,25,.4,.45,place.accent)
  for(let i=-2;i<=2;i++)block(g,x+i*4.15,3.2,z+6.1,3,4.2,.14,'#a1c8c9')
  textBoard(g,place)
  ground(g,x+16,z,11,130,'#beb5a6',.12)
  ground(g,x+25,z,10,140,'#585d59',.13)
  for(let dx of [21.8,27.9])block(g,x+dx-0,.35,z,.3,.28,136,'#c3ad98')
  for(let zz=-65;zz<=65;zz+=4.5)block(g,x+25,.23,z+zz,8,.23,.6,'#7e6c59')
  for(let j=0;j<2;j++){
    const zz=z-19+j*20
    block(g,x+25,3.3,zz,6.4,5.7,18.8,'#ebebdd')
    block(g,x+25,6.32,zz,6.6,.6,19,'#35494b')
    block(g,x+25,2.35,zz,6.6,1.2,19,place.accent)
    for(let wz of [-6,-2,2,6]){
      block(g,x+21.7,4.46,zz+wz,.08,1.5,2.1,'#8cbdc0')
      block(g,x+28.3,4.46,zz+wz,.08,1.5,2.1,'#8cbdc0')
    }
    for(let wz of [-6.2,6.2])for(let wx of [23,27])cylinder(g,x+wx,.59,zz+wz,.82,.82,.6,'#29383b')
  }
  ground(g,9,7,9,30,'#b7ad98',.09)
}
function decorate(g,id){
  const r=rng(({kyoto:1103,tokyo:138,hakone:331,kamakura:280})[id])
  if(id==='kyoto'){
    ground(g,0,0,280,280,'#829b7c')
    ground(g,0,-18,15,190,'#b3a594',.055)
    for(let z=-18;z>=-98;z-=22)torii(g,z,z===-18?1.1:1)
    for(let z=-80;z<=75;z+=23){house(g,-20,z,'#a49a88');house(g,21,z+5,'#ab927c');lightPost(g,-9,z)}
    for(let i=0;i<62;i++){const x=(r()-.5)*255,z=(r()-.5)*250;if(Math.abs(x)>34&&Math.hypot(x-STATION.x,z-STATION.z)>28)tree(g,x,z,r()<.76?'sakura':'normal',r)}
    for(let i=0;i<7;i++)mountain(g,-130+i*43,-126,30+r()*32,'#7a9388')
  }
  if(id==='tokyo'){
    ground(g,0,0,280,280,'#77818a')
    ground(g,0,0,24,275,'#46515c',.07)
    ground(g,0,-27,275,22,'#46515c',.08)
    for(let z=-115;z<115;z+=14)block(g,0,.13,z,.75,.02,6,'#e1d7be')
    for(let x=-110;x<120;x+=13)block(g,x,.14,-27,8,.025,1.35,'#eadfd1')
    const cs=['#8397ac','#71859a','#8795a4','#67798a']
    for(let x=-116;x<=116;x+=23)for(let z=-116;z<=116;z+=24){
      if(Math.abs(x)<23||Math.abs(z+27)<18||Math.hypot(x-STATION.x,z-STATION.z)<27)continue
      const h=15+r()*43,c=cs[Math.floor(r()*cs.length)]
      block(g,x,h/2,z,12+r()*5,h,12+r()*5,c)
      for(let y=5;y<h-2;y+=5){
        const neon=r()<.5?'#f7d7b1':'#abd1d9'
        block(g,x+7.2,y,z,.19,1.35,8,mat(neon,{emissive:neon,emissiveIntensity:.24}))
      }
      if(r()<.4)block(g,x,6,z+8.8,9,1.4,.18,mat('#e99ab2',{emissive:'#bd467f',emissiveIntensity:.55}))
    }
    for(let z=-100;z<110;z+=20){lightPost(g,-14,z,'#bb7891');lightPost(g,14,z,'#789bb3')}
  }
  if(id==='hakone'){
    ground(g,0,0,280,280,'#7faa96')
    ground(g,-66,0,79,118,'#8fc4c0',.055)
    ground(g,0,0,12,200,'#beb8a0',.06)
    for(let i=0;i<11;i++)mountain(g,-130+i*27,-125,43+r()*36,i%2?'#6e998a':'#598374')
    for(let i=0;i<8;i++)mountain(g,-125+i*42,132,30+r()*22,'#82a99b')
    house(g,-20,-12,'#bba78e','#52665e')
    house(g,20,38,'#c5b39a','#526a5e')
    for(let i=0;i<99;i++){
      const x=(r()-.5)*250,z=(r()-.5)*250
      if(Math.abs(x)<16||(x<-34&&x>-105&&Math.abs(z)<60)||Math.hypot(x-STATION.x,z-STATION.z)<25)continue
      tree(g,x,z,r()<.78?'pine':'normal',r)
    }
    for(let z=-98;z<=90;z+=23)lightPost(g,8,z,'#c9bb89')
  }
  if(id==='kamakura'){
    ground(g,0,0,280,280,'#c3bca0')
    ground(g,-83,0,118,280,'#8bbfc8',.055)
    ground(g,-25,0,10,280,'#e6cc99',.07)
    ground(g,0,0,11,280,'#949e9b',.075)
    for(let z=-107;z<110;z+=15)block(g,0,.1,z,.22,.03,6,'#eadcca')
    for(let z=-88;z<100;z+=22){house(g,21,z,'#d0c0a2','#647875');lightPost(g,9,z,'#dca578')}
    for(let i=0;i<68;i++){const x=23+r()*99,z=(r()-.5)*235;if(Math.hypot(x-STATION.x,z-STATION.z)>26)tree(g,x,z,r()<.24?'sakura':'normal',r)}
    for(let i=0;i<32;i++)ball(g,-34-r()*7,1,zRandom(r),.6+r()*.6,'#e4cd9f')
    torii(g,-56,.72)
  }
}
function zRandom(r){return (r()-.5)*250}
function avatarModel(){
  const g=new THREE.Group()
  const legA=new THREE.Group(),legB=new THREE.Group(),armA=new THREE.Group(),armB=new THREE.Group()
  block(g,0,2.8,0,1.55,2.4,.88,'#3e5960')
  ball(g,0,5.02,0,.76,'#e5c3a5')
  ball(g,0,5.48,-.13,.75,'#293a3d')
  for(const [leg,x] of [[legA,-.4],[legB,.4]]){leg.position.set(x,1.48,0);block(leg,0,-.6,0,.56,1.25,.67,'#2c4048');block(leg,0,-1.29,.18,.67,.35,1,'#233236');g.add(leg)}
  for(const [arm,x] of [[armA,-.98],[armB,.98]]){arm.position.set(x,3.7,0);block(arm,0,-.71,0,.47,1.64,.56,'#3e5960');g.add(arm)}
  return {g,legA,legB,armA,armB}
}
function freeMeshes(group){
  group.traverse(c=>{if(!c.isMesh)return;c.geometry?.dispose();(Array.isArray(c.material)?c.material:[c.material]).forEach(m=>{m?.map?.dispose();m?.dispose()})})
  group.clear()
}

export function createWorld(container,{onNearby,onBoard,onPosition,onError}={}){
  let renderer
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'})}
  catch{throw new Error('WebGL could not start. Try updating the browser or enabling graphics acceleration.')}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75))
  renderer.setSize(Math.max(1,container.clientWidth),Math.max(1,container.clientHeight))
  renderer.outputColorSpace=THREE.SRGBColorSpace
  renderer.toneMapping=THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure=1.35
  renderer.shadowMap.enabled=true
  renderer.shadowMap.type=THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)
  const scene=new THREE.Scene()
  const camera=new THREE.PerspectiveCamera(54,1,.1,560)
  const hemi=new THREE.HemisphereLight('#fff3df','#899997',2.2);scene.add(hemi)
  const sun=new THREE.DirectionalLight('#fff0df',3)
  sun.position.set(-35,70,45);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048)
  Object.assign(sun.shadow.camera,{left:-100,right:100,top:100,bottom:-100})
  scene.add(sun)
  const map=new THREE.Group();scene.add(map)
  const person=avatarModel();scene.add(person.g)
  const circle=new THREE.Mesh(new THREE.CircleGeometry(1.8,24),new THREE.MeshBasicMaterial({color:'#000000',transparent:true,opacity:.19}))
  circle.rotation.x=-Math.PI/2;scene.add(circle)
  const keys=new Set()
  let player={x:0,z:16},current='kyoto',near=false,stopped=false,raf=0,lastTime=performance.now(),frameCount=0,paused=false
  function setRegion(id){
    const place=locationById(id);current=place.id;freeMeshes(map)
    const bg=new THREE.Color(({kyoto:'#ead2b9',tokyo:'#b9b9c1',hakone:'#c3d2c6',kamakura:'#cadfe0'})[id]||'#ead2b9')
    scene.background=bg;scene.fog=new THREE.FogExp2(bg,.0048)
    decorate(map,id);addStation(map,place)
    player={x:0,z:16};person.g.position.set(0,.1,16)
    camera.position.set(27,27,59);camera.lookAt(0,3,16)
    near=false;onNearby?.(false);onPosition?.(player)
  }
  function down(e){
    if(paused)return
    if(e.target instanceof HTMLElement && ['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return
    const k=e.key.toLowerCase()
    if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift','e'].includes(k))e.preventDefault()
    if(k==='e'&&!e.repeat&&near)onBoard?.(current)
    keys.add(k)
  }
  function up(e){keys.delete(e.key.toLowerCase())}
  function blur(){keys.clear()}
  function lost(e){e.preventDefault();stopped=true;onError?.('The graphics context was lost. Please reload to restore 3D rendering.')}
  function resize(){
    const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight)
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)
  }
  const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;ro?.observe(container)
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);window.addEventListener('resize',resize)
  renderer.domElement.addEventListener('webglcontextlost',lost)
  function frame(now){
    if(stopped)return
    raf=requestAnimationFrame(frame)
    const dt=Math.min(.05,Math.max(0,(now-lastTime)/1000));lastTime=now
    try{
      const p=move(player,paused?EMPTY_KEYS:keys,dt)
      player={x:p.x,z:p.z}
      person.g.position.set(player.x,.13+(p.moving?Math.abs(Math.sin(now*.014))*.12:0),player.z)
      if(p.heading!==null){const a=Math.atan2(Math.sin(p.heading-person.g.rotation.y),Math.cos(p.heading-person.g.rotation.y));person.g.rotation.y+=a*.16}
      const swing=p.moving?Math.sin(now*.012)*.44:0
      person.legA.rotation.x=swing;person.legB.rotation.x=-swing
      person.armA.rotation.x=-swing*.75;person.armB.rotation.x=swing*.75
      circle.position.set(player.x,.08,player.z)
      camera.position.lerp(vector(player.x+27,27,player.z+43),Math.min(1,dt*3.5))
      camera.lookAt(player.x,3,player.z)
      const n=nearStation(player,STATION)
      if(n!==near){near=n;onNearby?.(near)}
      if(++frameCount%8===0)onPosition?.({...player})
      renderer.render(scene,camera)
    }catch(e){stopped=true;cancelAnimationFrame(raf);onError?.(e?.message||'Rendering stopped unexpectedly.')}
  }
  setRegion('kyoto');resize();raf=requestAnimationFrame(frame)
  return {
    setRegion,
    setInput(key,active){if(paused)return;if(active)keys.add(key);else keys.delete(key)},
    setInputEnabled(enabled){paused=!enabled;if(paused)keys.clear()},
    board(){if(near)onBoard?.(current)},
    current:()=>current,
    dispose(){
      stopped=true;cancelAnimationFrame(raf);ro?.disconnect()
      window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);window.removeEventListener('resize',resize)
      renderer.domElement.removeEventListener('webglcontextlost',lost)
      freeMeshes(map);freeMeshes(person.g)
      circle.geometry.dispose();circle.material.dispose()
      renderer.dispose();renderer.domElement.remove()
    }
  }
}
