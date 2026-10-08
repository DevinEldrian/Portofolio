import * as THREE from 'three'
import {locationById} from './locations.js'
import {move,nearStation} from './gameLogic.js'
import {HOTSPOT_POSITIONS,nearestHotspot} from './hotspotLogic.js'
import {HOTSPOTS} from './portfolioContent.js'
import {CAMERA_DEFAULTS,cameraAfterInput,cameraPose} from './cameraLogic.js'
import {createKyotoLiving} from './kyotoLiving.js'
import {createRailCinematic} from './railCinematic.js'
import {resolveWalk,rect} from './collisionLogic.js'
import {walkSurfaceY} from './terrainLogic.js'

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
  const wall=block(g,x,3.3,z,12,6.6,9,c);wall.userData.cameraBlocker=true
  block(g,x,7.1,z,13.5,1.1,10.3,roof)
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
  a.font='bold 62px Arial';a.fillText(place.id==='kyoto'?'ARASHIYAMA':'STATION',256,97)
  a.font='28px Arial';a.fillText(place.id==='kyoto'?'RANDEN TRAM · KYOTO':place.city+' LINE',256,148)
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(8.4,3.1),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}))
  mesh.position.set(STATION.x,9.4,STATION.z+6.15);g.add(mesh)
}
function addStoryKiosks(g){
 for(const item of HOTSPOTS){
  const p=HOTSPOT_POSITIONS[item.id]
  if(!p)continue
  const node=new THREE.Group()
  node.name='CV KIOSK '+item.label
  node.userData.hotspotId=item.id
  node.position.set(p.x,0,p.z)
  block(node,0,1.4,0,2.6,2.8,.5,'#3c5354')
  block(node,0,3.2,0,3.4,1.05,.65,mat('#f4daa9',{emissive:'#f1c582',emissiveIntensity:.23}))
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256
  const c=canvas.getContext('2d')
  if(c){
   c.fillStyle='#f5ebd6';c.fillRect(0,0,512,256)
   c.fillStyle='#243c3d';c.textAlign='center'
   c.font='bold 30px sans-serif';c.fillText('CV JOURNEY',256,56)
   c.font='bold 29px sans-serif';c.fillText(item.label.split(' · ')[0].slice(0,22),256,124)
   c.font='22px sans-serif';c.fillText('CLICK / E TO DISCOVER',256,188)
   const texture=new THREE.CanvasTexture(canvas)
   texture.colorSpace=THREE.SRGBColorSpace
   const sign=new THREE.Mesh(new THREE.PlaneGeometry(3.1,1.6),
     new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}))
   sign.position.set(0,2,.27);node.add(sign)
  }
  g.add(node)
 }
}
function addStation(g,place){
  const {x,z}=STATION
  ground(g,x,z,28,18,'#b5ac9b',.14)
  const stationWall=block(g,x,3.3,z,22,6.6,12,'#e4ddcd');stationWall.userData.cameraBlocker=true
  block(g,x,7.4,z,25,1.45,14,'#35494b')
  block(g,x,6.78,z+7,25,.4,.45,place.accent)
  for(let i=-2;i<=2;i++)block(g,x+i*4.15,3.2,z+6.1,3,4.2,.14,'#a1c8c9')
  textBoard(g,place)
  ground(g,x+16,z,11,130,'#beb5a6',.12)
  ground(g,x+25,z,10,140,'#585d59',.13)
  for(let dx of [21.8,27.9])block(g,x+dx-0,.35,z,.3,.28,136,'#c3ad98')
  for(let zz=-65;zz<=65;zz+=4.5)block(g,x+25,.23,z+zz,8,.23,.6,'#7e6c59')
  // Open-sided tram geometry, not a sealed solid block the avatar ghosts through.
  // Door gaps in the side panels at the middle of each Randen-inspired car.
  for(let j=0;j<2;j++){
    const zz=z-19+j*20,cx=x+25,purple=place.id==='kyoto'?'#72519b':place.accent
    block(g,cx,1.12,zz,6.5,.58,18.8,'#a7aaa6')
    block(g,cx,6.32,zz,6.7,.6,19,'#35494b')
    for(const end of [-9.35,9.35])block(g,cx,3.7,zz+end,6.6,5.4,.3,'#dedbca')
    for(const side of [-1,1]){
      const edge=cx+side*3.16
      // Mid-car 5.2 game-unit door aperture remains visibly open.
      for(const d of [-6,6]){
        block(g,edge,3.45,zz+d,.28,4.4,6.4,'#e6e4d7')
        block(g,edge,1.85,zz+d, .32,1.15,6.5,purple)
        const pane=block(g,edge+side*.07,4.4,zz+d,.12,1.3,4.8,
          mat('#97c3c9',{transparent:true,opacity:.55,metalness:.09}))
        pane.castShadow=false
      }
      block(g,edge,6,zz,.4,.28,5.4,purple)
      for(const d of [-2.8,2.8])cylinder(g,edge+side*.12,3.65,zz+d,.08,.08,4.6,'#dfd1bc')
    }
    for(const d of [-6,6]){
      block(g,cx-1.9,1.85,zz+d,.92,1.2,4,'#6c798a')
      block(g,cx+1.9,1.85,zz+d,.92,1.2,4,'#6c798a')
    }
    for(let wz of [-6.2,6.2])for(let wx of [23,27])
      cylinder(g,x+wx,.59,zz+wz,.82,.82,.6,'#29383b')
  }
  ground(g,9,7,9,30,'#b7ad98',.09)
}
function decorate(g,id){
  const r=rng(({kyoto:1103,tokyo:138,hakone:331,kamakura:280})[id])
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
      const tower=block(g,x,h/2,z,12+r()*5,h,12+r()*5,c);tower.userData.cameraBlocker=true
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
  group.traverse(c=>{if(!c.isMesh&&!c.isPoints)return;c.geometry?.dispose();(Array.isArray(c.material)?c.material:[c.material]).forEach(m=>{m?.map?.dispose();m?.dispose()})})
  group.clear()
}

export function createWorld(container,{onNearby,onBoard,onPosition,onError,onNearHotspot,onHotspot}={}){
  let renderer
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'})}
  catch{throw new Error('WebGL could not start. Try updating the browser or enabling graphics acceleration.')}
  const mobile=typeof window!=='undefined'&&window.matchMedia?.('(max-width: 760px)')?.matches
  const nativeDpr=typeof window!=='undefined'?window.devicePixelRatio||1:1
  let lowPower=!!mobile
  renderer.setPixelRatio(Math.min(nativeDpr,mobile?1.15:1.65))
  renderer.setSize(Math.max(1,container.clientWidth),Math.max(1,container.clientHeight))
  renderer.outputColorSpace=THREE.SRGBColorSpace
  renderer.toneMapping=THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure=1.35
  renderer.shadowMap.enabled=!lowPower
  renderer.shadowMap.type=THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)
  const scene=new THREE.Scene()
  const camera=new THREE.PerspectiveCamera(54,1,.1,560)
  const hemi=new THREE.HemisphereLight('#fff3df','#899997',2.2);scene.add(hemi)
  const sun=new THREE.DirectionalLight('#fff0df',3)
  sun.position.set(-35,70,45);sun.castShadow=!lowPower;sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048)
  Object.assign(sun.shadow.camera,{left:-100,right:100,top:100,bottom:-100})
  scene.add(sun)
  const map=new THREE.Group();scene.add(map)
  const rail=createRailCinematic(scene)
  const reducedMotion=typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  let living=null,weather='golden'
  const person=avatarModel();scene.add(person.g)
  const circle=new THREE.Mesh(new THREE.CircleGeometry(1.8,24),new THREE.MeshBasicMaterial({color:'#000000',transparent:true,opacity:.19}))
  circle.rotation.x=-Math.PI/2;scene.add(circle)
  const keys=new Set()
  const raycaster=new THREE.Raycaster()
  const pointer=new THREE.Vector2()
  const cameraRaycaster=new THREE.Raycaster()
  const cameraObstacles=[]
  const solidFootprints=[]
  const cameraFrom=new THREE.Vector3(),cameraDesired=new THREE.Vector3(),cameraDirection=new THREE.Vector3()
  let cameraState={...CAMERA_DEFAULTS},drag=null,contextLost=false,disposed=false
  let player={x:0,z:16},current='kyoto',near=false,nearStory=null,stopped=false,raf=0,lastTime=performance.now(),frameCount=0,paused=false
  // Local-only QA diagnostics. Vite strips this from production builds.
  if(import.meta.env.DEV)window.__KISEKI_QA__={
    snapshot:()=>({x:player.x,z:player.z,frameCount,paused,keys:[...keys],stopped,region:current})
  }
  function setRegion(id){
    const place=locationById(id);current=place.id;living=null;freeMeshes(map)
    const bg=new THREE.Color(({kyoto:'#ead2b9',tokyo:'#b9b9c1',hakone:'#c3d2c6',kamakura:'#cadfe0'})[id]||'#ead2b9')
    scene.background=bg;scene.fog=new THREE.FogExp2(bg,.0038)
    if(id==='kyoto')living=createKyotoLiving(map,{reducedMotion});else decorate(map,id)
    addStation(map,place);if(id==='kyoto')addStoryKiosks(map)
    living?.setWeather(weather)
    living?.setPerformanceMode(lowPower)
    cameraObstacles.length=0
    solidFootprints.length=0
    map.updateMatrixWorld(true)
    map.traverse(node=>{
      if(!node.isMesh||!node.userData.cameraBlocker)return
      cameraObstacles.push(node)
      const bounds=new THREE.Box3().setFromObject(node)
      if(bounds.min.y<4.9 && bounds.max.y>.5){
        const width=bounds.max.x-bounds.min.x
        const depth=bounds.max.z-bounds.min.z
        if(width>.1&&depth>.1)
          solidFootprints.push(rect((bounds.max.x+bounds.min.x)/2,(bounds.max.z+bounds.min.z)/2,width,depth,'solid building'))
      }
    })
    // Keep exploration avatars off the track and inside the station boarding
    // trigger; the cinematic explicitly takes control once Boarding starts.
    for(let car=0;car<2;car++)
      solidFootprints.push(rect(STATION.x+25,STATION.z-19+car*20,6.6,18.8,'tram'))
    if(living)solidFootprints.push(...living.colliders)
    if(id==='kyoto')for(const pos of Object.values(HOTSPOT_POSITIONS))
      solidFootprints.push(rect(pos.x,pos.z,2.6,.5,'CV information sign'))
    cameraState={...CAMERA_DEFAULTS}
    player={x:0,z:16};person.g.position.set(0,.1,16)
    const start=cameraPose({x:player.x,y:3,z:player.z},cameraState)
    camera.position.set(start.position.x,start.position.y,start.position.z)
    camera.lookAt(start.target.x,start.target.y,start.target.z)
    near=false;nearStory=null;onNearby?.(false);onNearHotspot?.(null);onPosition?.(player)
  }
  function down(e){
    if(paused)return
    if(e.target instanceof HTMLElement && e.target.closest('input,textarea,select,button,a,[role="dialog"],[contenteditable="true"]'))return
    const k=e.key.toLowerCase()
    if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift','e'].includes(k))e.preventDefault()
    if(k==='e'&&!e.repeat){if(nearStory)onHotspot?.(nearStory);else if(near)onBoard?.(current)}
    keys.add(k)
  }
  function pickStory(e){
    if(paused||current!=='kyoto')return
    const rect=renderer.domElement.getBoundingClientRect()
    if(!rect.width||!rect.height)return
    pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1)
    raycaster.setFromCamera(pointer,camera)
    // Only allow the foremost visible kiosk at reachable walking distance.
    // Do not click signs through foreground shop walls, props or terrain.
    const hit=raycaster.intersectObjects(map.children,true)[0]
    if(!hit)return
    let node=hit.object
    while(node&&!node.userData?.hotspotId)node=node.parent
    const id=node?.userData?.hotspotId
    const target=HOTSPOT_POSITIONS[id]
    if(target&&Math.hypot(target.x-player.x,target.z-player.z)<=12)
      onHotspot?.(id)
  }
  function orbitStart(e){
    if(paused||e.button!==0)return
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false}
    renderer.domElement.setPointerCapture?.(e.pointerId)
  }
  function orbitMove(e){
    if(paused||!drag||drag.id!==e.pointerId)return
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y
    if(Math.abs(dx)+Math.abs(dy)>2)drag.moved=true
    if(drag.moved)cameraState=cameraAfterInput(cameraState,{yaw:-dx*.006,pitch:dy*.006})
    drag.x=e.clientX;drag.y=e.clientY
  }
  function orbitEnd(e){
    const moved=drag?.id===e.pointerId&&drag.moved
    if(drag?.id===e.pointerId)drag=null
    if(!moved)pickStory(e)
  }
  function orbitCancel(){drag=null}
  function zoom(e){
    if(paused)return
    e.preventDefault()
    cameraState=cameraAfterInput(cameraState,{zoom:e.deltaY*.016})
  }
  function up(e){keys.delete(e.key.toLowerCase())}
  function blur(){keys.clear()}
  function lost(e){
    e.preventDefault()
    if(disposed)return
    contextLost=true;stopped=true;cancelAnimationFrame(raf);keys.clear();drag=null
    onError?.('The graphics context was lost. Waiting for the browser to restore it; Quick View remains available.')
  }
  function restored(){
    if(disposed||!contextLost)return
    contextLost=false;stopped=false;lastTime=performance.now()
    resize();onError?.('')
    raf=requestAnimationFrame(frame)
  }
  function resize(){
    const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight)
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)
  }
  const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;ro?.observe(container)
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);window.addEventListener('resize',resize)
  renderer.domElement.addEventListener('webglcontextlost',lost)
  renderer.domElement.addEventListener('webglcontextrestored',restored)
  renderer.domElement.addEventListener('pointerdown',orbitStart)
  renderer.domElement.addEventListener('pointermove',orbitMove)
  renderer.domElement.addEventListener('pointerup',orbitEnd)
  renderer.domElement.addEventListener('pointercancel',orbitCancel)
  renderer.domElement.addEventListener('lostpointercapture',orbitCancel)
  renderer.domElement.addEventListener('wheel',zoom,{passive:false})
  function frame(now){
    if(stopped)return
    raf=requestAnimationFrame(frame)
    const dt=Math.min(.05,Math.max(0,(now-lastTime)/1000));lastTime=now
    try{
      if(rail.update(dt,now,camera,person,{reducedMotion})){
        living?.update(dt,now,weather,player)
        renderer.render(scene,camera)
        return
      }
      const p=move(player,paused?EMPTY_KEYS:keys,dt)
      const footprints=living?solidFootprints.concat(living.getDynamicColliders()):solidFootprints
      const next=resolveWalk(player,p,footprints)
      const walked=p.moving&&Math.hypot(next.x-player.x,next.z-player.z)>.002
      player={x:next.x,z:next.z}
      const footing=walkSurfaceY(current,player)
      person.g.position.set(player.x,footing+(walked?Math.abs(Math.sin(now*.014))*.12:0),player.z)
      if(p.heading!==null){const a=Math.atan2(Math.sin(p.heading-person.g.rotation.y),Math.cos(p.heading-person.g.rotation.y));person.g.rotation.y+=a*.16}
      const swing=walked?Math.sin(now*.012)*.44:0
      person.legA.rotation.x=swing;person.legB.rotation.x=-swing
      person.armA.rotation.x=-swing*.75;person.armB.rotation.x=swing*.75
      circle.position.set(player.x,Math.max(.08,footing-.05),player.z)
      const pose=cameraPose({x:player.x,y:3,z:player.z},cameraState)
      cameraFrom.set(pose.target.x,pose.target.y,pose.target.z)
      cameraDesired.set(pose.position.x,pose.position.y,pose.position.z)
      cameraDirection.copy(cameraDesired).sub(cameraFrom)
      const length=cameraDirection.length()
      if(length>.001){
        cameraDirection.multiplyScalar(1/length)
        cameraRaycaster.set(cameraFrom,cameraDirection)
        cameraRaycaster.near=.25;cameraRaycaster.far=length
        const obstruction=cameraRaycaster.intersectObjects(cameraObstacles,false)[0]
        if(obstruction&&obstruction.distance<length)
          cameraDesired.copy(cameraFrom).addScaledVector(cameraDirection,Math.max(2.6,obstruction.distance-.8))
      }
      cameraDesired.y=Math.max(2.5,cameraDesired.y)
      camera.position.lerp(cameraDesired,Math.min(1,dt*8))
      camera.lookAt(pose.target.x,pose.target.y,pose.target.z)
      const n=nearStation(player,STATION)
      if(n!==near){near=n;onNearby?.(near)}
      const h=current==='kyoto'?nearestHotspot(player):null
      if(h!==nearStory){nearStory=h;onNearHotspot?.(h)}
      living?.update(dt,now,weather,player)
      if(++frameCount%8===0)onPosition?.({...player})
      renderer.render(scene,camera)
    }catch(e){stopped=true;cancelAnimationFrame(raf);onError?.(e?.message||'Rendering stopped unexpectedly.')}
  }
  setRegion('kyoto');resize();raf=requestAnimationFrame(frame)
  return {
    setRegion,
    setPerformanceMode(enabled){
      lowPower=!!enabled
      renderer.setPixelRatio(Math.min(nativeDpr,lowPower?1:mobile?1.15:1.65))
      renderer.shadowMap.enabled=!lowPower
      sun.castShadow=!lowPower
      living?.setPerformanceMode(lowPower)
      resize()
    },
    setWeather(next){
      weather=next==='drizzle'?'drizzle':'golden'
      living?.setWeather(weather)
      if(current==='kyoto'){
        const sky=new THREE.Color(weather==='drizzle'?'#87969e':'#e7c8a0')
        scene.background=sky;scene.fog.color.copy(sky)
        sun.intensity=weather==='drizzle'?1.45:3
        hemi.intensity=weather==='drizzle'?1.6:2.2
      }
      return weather
    },
    setJourneyPhase(phase){rail.setPhase(phase)},
    setInput(key,active){if(paused)return;if(active)keys.add(key);else keys.delete(key)},
    setInputEnabled(enabled){paused=!enabled;if(paused){keys.clear();drag=null}},
    board(){if(near)onBoard?.(current)},
    current:()=>current,
    dispose(){
      if(import.meta.env.DEV)delete window.__KISEKI_QA__
      disposed=true;stopped=true;cancelAnimationFrame(raf);ro?.disconnect()
      window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);window.removeEventListener('resize',resize)
      renderer.domElement.removeEventListener('webglcontextlost',lost)
      renderer.domElement.removeEventListener('webglcontextrestored',restored)
      renderer.domElement.removeEventListener('pointerdown',orbitStart)
      renderer.domElement.removeEventListener('pointermove',orbitMove)
      renderer.domElement.removeEventListener('pointerup',orbitEnd)
      renderer.domElement.removeEventListener('pointercancel',orbitCancel)
      renderer.domElement.removeEventListener('lostpointercapture',orbitCancel)
      renderer.domElement.removeEventListener('wheel',zoom)
      freeMeshes(map);freeMeshes(person.g);rail.dispose()
      circle.geometry.dispose();circle.material.dispose()
      renderer.dispose();renderer.domElement.remove()
    }
  }
}
