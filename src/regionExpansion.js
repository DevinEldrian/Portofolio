import * as THREE from 'three'
import {materialPBR} from './pbrMaterials.js'
import {rect} from './collisionLogic.js'

const prng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
const lit=(c,intensity=1)=>new THREE.MeshPhysicalMaterial({color:c,emissive:c,emissiveIntensity:intensity,roughness:.35,metalness:.21})
const make=(g,x,y,z,w,h,d,mat)=>{
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z)
  m.castShadow=true;m.receiveShadow=true;g.add(m);return m
}
const plane=(g,x,z,w,d,m,y=.065)=>{
  const o=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m)
  o.rotation.x=-Math.PI/2;o.position.set(x,y,z);o.receiveShadow=true;g.add(o);return o
}
const rust=materialPBR('bronze',{color:'#56636a'})
const glass=new THREE.MeshPhysicalMaterial({color:'#83b4c2',metalness:.65,roughness:.11,transparent:true,opacity:.7,clearcoat:.8})
function neonSign(g,word,x,y,z,side,color){
  const c=document.createElement('canvas');c.width=512;c.height=256
  const d=c.getContext('2d');d.fillStyle='#121d2d';d.fillRect(0,0,512,256)
  d.fillStyle=color;d.fillRect(0,0,512,15);d.fillRect(0,241,512,15)
  d.fillStyle='#e9e6e2';d.font='700 72px sans-serif';d.textAlign='center';d.textBaseline='middle'
  d.fillText(word,256,126,485)
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(7.5,3.1),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}))
  sign.position.set(x,y,z);sign.rotation.y=side*Math.PI/2;g.add(sign)
}
function detailedStore(g,id,x,z,side,index){
  const wall=materialPBR(id==='kyoto'?'agedWood':'stucco',{color:id==='kyoto'?'#9b8369':['#637283','#818594','#6e7189'][index%3]})
  const front=x-side*7.5
  make(g,x,5,z,14,10,11,wall)
  const eave=make(g,x,10.5,z,16.6,.85,13.1,materialPBR(id==='kyoto'?'roofTile':'bronze'))
  eave.rotation.z=id==='kyoto'?side*.11:0
  for(let j=-2;j<=2;j++){
    const pane=make(g,front-side*.35,4.3,z+j*2,.16,4.5,1.7,glass);pane.castShadow=false
    make(g,front-side*.46,6.7,z+j*2,.22,.13,1.95,rust)
    make(g,front-side*.7,2.05,z+j*2,.17,2.5,.24,rust)
  }
  const brand=id==='akihabara'?['電子部品','ゲームセンター','フィギュア','メイドカフェ','オーディオ','中古ゲーム'][index%6]
    :id==='shibuya'?['SHIBUYA','MUSIC','FASHION','CAFE','DESIGN','TOKYO'][index%6]
    :['抹茶','和菓子','木工','茶屋','京菓子','京都土産'][index%6]
  neonSign(g,brand,front-side*.9,8,z,side,
    id==='kyoto'?'#b5a076':id==='akihabara'?'#e68aca':'#8ccbe5')
  for(let j=-1;j<=1;j++)make(g,front-side*1.3,1.25,z+j*2.15,.75,1.5,1.6,
      materialPBR(id==='kyoto'?'agedWood':'bronze'))
}
function makeLamp(g,x,z,id){
  const pole=make(g,x,3.3,z,.19,6.6,.2,rust);pole.castShadow=false
  const c=id==='kyoto'?'#f8c895':id==='akihabara'?'#a9ddf9':'#e3d1ba'
  const light=make(g,x,6.5,z,1.1,.32,1.5,lit(c,.9));light.castShadow=false
}
/**
 * Build contiguous 520m regions, not a 30m toy plaza.
 * Distant buildings are drawn as GPU instances; detailed shop-front geometry
 * is focused along traversable pedestrian routes with building collisions.
 * These are fictional reconstructions, NOT surveyed Tier A landmarks.
 */
export function createRegionExpansion(root,id){
  const g=new THREE.Group();g.name=id+' 520m neighborhood envelope';root.add(g)
  const r=prng(id==='akihabara'?20261008:id==='shibuya'?10608:70108)
  const asphalt=materialPBR('asphalt',{color:id==='kyoto'?'#5c5750':'#474d59'})
  const walkway=materialPBR(id==='kyoto'?'cobble':'pavement')
  plane(g,0,0,540,540,walkway,.012)
  const lines=[-204,-102,0,102,204]
  for(const axis of lines){
    plane(g,axis,0,id==='kyoto'?12:19,520,asphalt,.027)
    plane(g,0,axis,520,id==='kyoto'?11:19,asphalt,.03)
  }
  const white=new THREE.MeshStandardMaterial({color:'#d9d9d4',roughness:.77})
  for(const v of lines)for(let z=-243;z<245;z+=20)make(g,v,.065,z,.13,.02,4.2,white)
  for(const x of lines)for(const z of lines)for(let k=-4;k<=4;k++){
    make(g,x+k*1.95,.079,z+13,1.25,.023,4.9,white)
    make(g,x+k*1.95,.079,z-13,1.25,.023,4.9,white)
  }
  const batches=[[],[],[]],roofBatches=[[],[],[]],colliders=[]
  for(let ix=-8;ix<=8;ix++)for(let iz=-8;iz<=8;iz++){
    const x=ix*29+r()*7-3,z=iz*29+r()*7-3
    if(Math.abs(x)>240||Math.abs(z)>240)continue
    if(lines.some(v=>Math.abs(x-v)<22)||lines.some(v=>Math.abs(z-v)<22))continue
    const w=14+r()*9,d=14+r()*9
    const height=id==='kyoto'?8+r()*8:id==='shibuya'?21+r()*55:12+r()*36
    const band=id==='kyoto'?2:Math.floor(r()*3)
    batches[band].push({x,y:.05+height/2,z,w,h:height,d})
    roofBatches[band].push({x,y:.2+height,z,w:w+1.2,h:.8,d:d+1.3})
    colliders.push(rect(x,z,w,d,'district-block'))
  }
  function instances(points,material){
    if(!points.length)return
    const geo=new THREE.BoxGeometry(1,1,1)
    const instance=new THREE.InstancedMesh(geo,material,points.length)
    const dummy=new THREE.Object3D()
    points.forEach((p,i)=>{
      dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.w,p.h,p.d)
      dummy.updateMatrix();instance.setMatrixAt(i,dummy.matrix)
    })
    instance.instanceMatrix.needsUpdate=true
    instance.castShadow=false;instance.receiveShadow=true;g.add(instance)
  }
  const colors=['#626f84','#85909d',id==='kyoto'?'#947c67':'#505e70']
  for(let i=0;i<3;i++){
    instances(batches[i],materialPBR(id==='kyoto'?'agedWood':'stucco',{color:colors[i]}))
    instances(roofBatches[i],materialPBR(id==='kyoto'?'roofTile':'bronze'))
  }
  for(let j=0;j<8;j++)for(const side of [-1,1]){
    const z=-224+j*61
    if(Math.hypot(side*30-20,z+10)<35)continue
    detailedStore(g,id,side*30,z,side,j)
    colliders.push(rect(side*30,z,14,11,'detail-store'))
    makeLamp(g,side*12,z+9,id)
  }
  for(let j=-10;j<=10;j++){
    const z=j*22
    const bench=make(g,11,1.05,z+4,2.2,.3,.65,materialPBR('agedWood'))
    bench.castShadow=false
    make(g,-11,.4,z+9,.9,.7,.9,materialPBR('bronze',{color:'#566a72'}))
  }
  if(id==='shibuya'){
    make(g,-48,34,-43,.4,27,26,lit('#779fc7',1.35))
    neonSign(g,'SCRAMBLE',-47.5,52,-43,1,'#a2c0e8')
  }else if(id==='akihabara'){
    for(let i=0;i<15;i++){
      const z=-200+i*28
      const pole=make(g,-13,5,z,.13,10,.13,rust);pole.castShadow=false
      make(g,-13,9.3,z+2,6,.13,.13,rust)
    }
  }else{
    const bark=materialPBR('agedWood')
    const autumn=['#aa583c','#c17a45','#cf9155'].map(c=>materialPBR('fabric',{color:c}))
    for(let i=0;i<30;i++){
      const z=-225+i*16,x=13+(i%3)*4
      make(g,x,3.8,z,.44,7.6,.5,bark)
      const leaves=new THREE.Mesh(new THREE.IcosahedronGeometry(2.9,2),autumn[i%3])
      leaves.position.set(x,8.1,z);leaves.castShadow=true;g.add(leaves)
    }
  }
  return {colliders,extentM:520,layout:id}
}
