import * as THREE from 'three'
import {materialPBR} from './pbrMaterials.js'
import {createRegionExpansion} from './regionExpansion.js'
import {circle,rect} from './collisionLogic.js'

const mat=(c,p={})=>new THREE.MeshPhysicalMaterial({color:c,roughness:.65,metalness:.08,...p})
const glow=(c,p=1.5)=>mat(c,{emissive:c,emissiveIntensity:p,roughness:.28,metalness:.23})
const makeBox=(g,x,y,z,w,h,d,m,solid=false)=>{
  const a=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof m==='string'?mat(m):m)
  a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true
  if(solid)a.userData.cameraBlocker=true
  g.add(a);return a
}
const floor=(g,x,z,w,d,m,y=.02)=>{
  const a=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m)
  a.rotation.x=-Math.PI/2;a.position.set(x,y,z);a.receiveShadow=true;g.add(a);return a
}
function sign(g,label,x,y,z,width=7,height=2,rotation=0,accent='#f4c8a2'){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=240
  const cx=canvas.getContext('2d')
  if(!cx)return
  cx.fillStyle='#14162a';cx.fillRect(0,0,768,240)
  cx.fillStyle=accent;cx.fillRect(0,0,768,19)
  cx.fillStyle='#f2e2cd';cx.textAlign='center';cx.textBaseline='middle'
  cx.font='bold 63px sans-serif';cx.fillText(label.slice(0,22),384,123)
  cx.fillStyle='#c5aac6';cx.font='29px sans-serif';cx.fillText('KISEKI · JAPAN',384,202)
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace
  const m=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}))
  m.position.set(x,y,z);m.rotation.y=rotation;g.add(m)
}
function passerby(g,x,z,color,index){
  const human=new THREE.Group()
  human.position.set(x,.22,z)
  const head=new THREE.Mesh(new THREE.SphereGeometry(.43,16,12),mat('#d6ad8f',{roughness:.94}))
  head.position.set(0,3.92,0);human.add(head)
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.44,16,12),mat('#2e2627'))
  hair.position.set(0,4.14,-.06);hair.scale.y=.38;human.add(hair)
  const coat=new THREE.Mesh(new THREE.CapsuleGeometry(.64,1.22,5,12),materialPBR('fabric',{color}))
  coat.position.y=2.61;coat.scale.z=.75;human.add(coat)
  const leftLeg=new THREE.Group(),rightLeg=new THREE.Group()
  for(const [group,offset] of [[leftLeg,-.26],[rightLeg,.26]]){
    group.position.set(offset,1.74,0)
    const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.22,.9,4,9),materialPBR('fabric',{color:'#334354'}))
    leg.position.y=-.78;group.add(leg);human.add(group)
  }
  human.rotation.y=index%2?Math.PI:0
  g.add(human)
  return {human,leftLeg,rightLeg,x,z,index}
}
function shopFacade(g,x,z,seed){
  const sx=Math.sign(x),front=x-sx*5.45
  const wall=makeBox(g,x,10,z,11,20,13,materialPBR('stucco',{color:seed%2?'#8191a4':'#74808a'}),true)
  wall.userData.cameraBlocker=true
  // Architecture has framed floor-by-floor glass, signage and shop awnings.
  const glass=mat('#8bbee1',{metalness:.63,roughness:.09,transparent:true,opacity:.68,clearcoat:.9})
  for(let level=0;level<4;level++)for(let strip=-2;strip<=2;strip++){
    makeBox(g,front-sx*.16,4+level*4, z+strip*2.2,.18,2.4,1.65,glass)
    makeBox(g,front-sx*.2,5.4+level*4,z+strip*2.2,.22,.17,2.02,materialPBR('bronze'))
  }
  const neonColor=['#f1518d','#65baff','#db64e5','#f3b25b'][seed%4]
  const lamp=glow(neonColor,1.8)
  makeBox(g,front-sx*.8,3.3,z,1.1,2.2,11,lamp)
  sign(g,['電気街','ゲーム','電子部品','アニメ','FIGURES','ARCADE'][seed%6],
    front-sx*1.45,8,z,9.8,2.2,Math.PI/2,neonColor)
  makeBox(g,x,21,z,12.4,1.4,14,materialPBR('roofTile'))
  const awning=makeBox(g,front-sx*1.9,5.5,z,3,.34,13,materialPBR('bronze',{color:neonColor}))
  awning.rotation.z=sx*.08
}
function vending(g,x,z,i){
  const steel=materialPBR('bronze',{color:i%2?'#abb5bd':'#bd686c'})
  const main=makeBox(g,x,1.5,z,1.2,3,.85,steel)
  const screen=makeBox(g,x,.95,z+.47,.96,1.5,.06,mat('#d7f2f1',{emissive:'#8bb1bc',emissiveIntensity:.7}))
  main.userData.prop='vending';screen.castShadow=false
  for(let y=1.7;y<2.8;y+=.31)for(let j=-1;j<=1;j++)
    makeBox(g,x+j*.27,y,z+.52,.18,.23,.08,glow(['#f26f93','#9ccfea','#e6cb77'][j+1],.7))
}
function torii(g,x,z){
  const red=materialPBR('bronze',{color:'#bb3e2e'})
  for(const d of [-3.8,3.8])makeBox(g,x+d,4.4,z,.75,8.8,.84,red)
  makeBox(g,x,9,z,10.5,1.05,1.2,red)
  makeBox(g,x,9.6,z,11.6,.27,1.4,materialPBR('roofTile'))
  makeBox(g,x,6.8,z,8.7,.26,.75,red)
}
function pagoda(g,x,z){
  const roof=materialPBR('roofTile')
  const wood=materialPBR('agedWood')
  for(let i=0;i<4;i++){
    const y=3+i*5
    const body=makeBox(g,x,y+1.3,z,10-i*1.25,4.5,9-i,wood,i===0)
    for(let k=-1;k<=1;k++)makeBox(g,x+k*2.3,y+1.5,z+4-i*.5,.2,2,.2,materialPBR('bronze'))
    const eave=makeBox(g,x,y+3.9,z,13-i,1,11-i,roof)
    eave.rotation.z=i%2?.02:-.02
    body.castShadow=true
  }
  const peak=new THREE.Mesh(new THREE.ConeGeometry(2.2,5,12),roof)
  peak.position.set(x,24,z);g.add(peak)
}
function machiya(g,x,z,i){
  const sx=Math.sign(x)
  makeBox(g,x,3.5,z,12,7,10,materialPBR('agedWood',{color:i%2?'#ab8c74':'#927d6a'}),true)
  const eave=makeBox(g,x,7.65,z,14.3,.85,12.5,materialPBR('roofTile'));eave.rotation.z=sx*.065
  for(let d=-3;d<=3;d+=1.3){
    makeBox(g,x-sx*6.25,3.75,z+d,.15,5.3,.15,materialPBR('agedWood'))
  }
  const paper=mat('#d7ad80',{emissive:'#c98a45',emissiveIntensity:.34})
  for(const d of [-3,0,3])makeBox(g,x-sx*6.2,4,z+d,.14,2.7,1.2,paper)
  const awning=makeBox(g,x-sx*7.35,5.4,z,2.5,.15,10,materialPBR('agedWood'))
  awning.rotation.z=sx*.08
}
function lantern(g,x,z,i){
  const rope=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,5,8),materialPBR('bronze'))
  rope.position.set(x,2.5,z);g.add(rope)
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(.74,16,12),mat('#ffd7a2',{emissive:'#f19e5e',emissiveIntensity:1.35,roughness:1}))
  sphere.scale.y=1.2;sphere.position.set(x,5.25,z);g.add(sphere)
  if(i%4===0){const l=new THREE.PointLight('#ffaf75',2,15,2);l.position.set(x,5.25,z);g.add(l)}
}
export function createJapanDistrict(root,id){
  const g=new THREE.Group();g.name='KISEKI detailed '+id;root.add(g)
  const expansion=createRegionExpansion(root,id)
  staticColliders.push(...expansion.colliders)
  const npcs=[],staticColliders=[]
  const r=(()=>{let seed=id==='akihabara'?37:id==='shibuya'?202:97;return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}})()
  if(id==='akihabara'){
    floor(g,0,0,520,520,materialPBR('pavement',{color:'#555d69'}))
    floor(g,0,0,18,300,materialPBR('asphalt'),.08)
    floor(g,0,-39,300,24,materialPBR('asphalt'),.08)
    for(let z=-121;z<125;z+=11)makeBox(g,0,.1,z,.65,.05,5,mat('#d4d1d0'))
    for(let j=0;j<15;j++)for(const side of [-1,1]){
      const z=-116+j*15.7,x=side*(21+r()*3)
      if(Math.hypot(x-20,z+10)<23)continue
      shopFacade(g,x,z,j)
    }
    for(let z=-120;z<125;z+=20)for(const side of [-1,1]){
      vending(g,side*14,z,Math.round(z/20))
      makeBox(g,side*14,.26,z+4,2,.5,2,materialPBR('bronze'))
    }
    for(let i=0;i<16;i++){
      const x=(r()-.5)*11,z=-120+r()*240
      npcs.push(passerby(g,x,z,['#9f7189','#587e8b','#a78c63','#576881'][i%4],i))
    }
  }else if(id==='shibuya'){
    floor(g,0,0,520,520,materialPBR('pavement',{color:'#7d7781'}))
    floor(g,0,-7,150,50,materialPBR('asphalt'),.06)
    floor(g,0,0,48,170,materialPBR('asphalt'),.07)
    // The diagonal scramble is walkable, textured, and physically 3D.
    const stripe=mat('#e7e1d8',{roughness:.66})
    for(let i=-10;i<=10;i++){
      const z=i*2.4
      const crossing=makeBox(g,i*1.1,.11,z,1.55,.045,28,stripe)
      crossing.rotation.y=Math.PI/4
    }
    for(let z=-100;z<102;z+=12)for(const side of [-1,1]){
      if(Math.hypot(side*40-20,z+10)<26)continue
      const x=side*(40+r()*14)
      shopFacade(g,x,z,Math.floor(r()*15))
      sign(g,'SHIBUYA CITY',x-(side*7),16,z,9,1.7,Math.PI/2,'#f09ba9')
    }
    for(let i=0;i<24;i++){
      const x=(r()-.5)*27,z=(r()-.5)*72
      npcs.push(passerby(g,x,z,['#506884','#d3a4a0','#766887','#707f76'][i%4],i))
    }
    for(let i=-5;i<=5;i++){
      const signpost=makeBox(g,26,.8,i*12,.3,1.6,.32,materialPBR('bronze'))
      signpost.castShadow=false
    }
  }else{
    floor(g,0,0,520,520,materialPBR('stucco',{color:'#7b8a70'}))
    floor(g,0,0,13,260,materialPBR('cobble'),.08)
    for(let j=0;j<15;j++){
      const z=-121+j*17
      if(Math.hypot(20,z+10)<28)continue
      for(const side of [-1,1])machiya(g,side*19,z,j)
      lantern(g,-10,z,j);lantern(g,10,z,j+1)
    }
    pagoda(g,-60,-88)
    for(let j=0;j<13;j++)torii(g,0,-120+j*4.25)
    for(let j=0;j<12;j++)npcs.push(passerby(g,(j%2?1:-1)*3,-110+j*19,['#9e7077','#6b7e69','#776b78'][j%3],j))
    sign(g,'京都 · KYOTO',0,12,56,13,2.8,0,'#ddb58b')
  }
  let reduced=false
  return {
    colliders:staticColliders,
    getDynamicColliders(){return npcs.map(n=>circle(n.human.position.x,n.human.position.z,.7,'pedestrian'))},
    setPerformanceMode(low){reduced=!!low},
    setWeather(){},
    update(dt,now,weather,player){
      for(const n of npcs){
        const phase=now*.00017+n.index*.67
        const swing=!reduced?Math.sin(now*.004+n.index)*.45:0
        // Restrict crossing NPC motions to paved public space near the world axes.
        if(id==='shibuya'){
          n.human.position.x=n.x+Math.sin(phase)*5
          n.human.position.z=n.z+Math.cos(phase)*4
        }else{
          n.human.position.x=n.x
          n.human.position.z=n.z+Math.sin(phase)*2.5
        }
        n.leftLeg.rotation.x=swing;n.rightLeg.rotation.x=-swing
        n.human.rotation.y=Math.cos(phase)>0?0:Math.PI
      }
    }
  }
}
