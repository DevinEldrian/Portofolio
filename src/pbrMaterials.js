import * as THREE from 'three'

/**
 * Textured environment art, not flat MeshStandardMaterial color blocks.
 *
 * Offline-generated, seamless PBR triplets (baseColor, tangent-space normal,
 * roughness) using tileable value noise, grain, joint masks and surface wear.
 * These are original procedural materials, so no unlicensed photo assets.
 * They intentionally leave room for future surveyed/photogrammetry facades.
 */
const sources=new Map()
const colored=new Map()
const scanned=new Map()
const scansInFlight=new Set()
// Poly Haven CC0 photographic scans: downloaded progressively after a zone loads.
// If offline/CDN unavailable, the procedurally generated PBR triplet stays active.
const scans={
  cobble:'rock_tile_floor',
  agedWood:'wood_plank_wall',
  pavement:'worn_patterned_pavers'
}
function upgradeKindWithPhotoScans(kind){
  const id=scans[kind]
  if(!id||scansInFlight.has(kind))return
  scansInFlight.add(kind)
  const prefix='https://dl.polyhaven.org/file/ph-assets/Textures/png/2k/'+id+'/'+id
  const loader=new THREE.TextureLoader()
  const urls=[prefix+'_diff_2k.png',prefix+'_nor_gl_2k.png',prefix+'_arm_2k.png']
  Promise.all(urls.map(url=>new Promise((resolve,reject)=>
    loader.load(url,resolve,undefined,reject)
  ))).then(textures=>{
    const spec=defaults[kind]
    for(let i=0;i<textures.length;i++){
      const tex=textures[i]
      tex.wrapS=tex.wrapT=THREE.RepeatWrapping
      tex.repeat.set(...spec.repeat)
      tex.anisotropy=12
      tex.colorSpace=i===0?THREE.SRGBColorSpace:THREE.NoColorSpace
      tex.needsUpdate=true
    }
    scanned.set(kind,textures)
    for(const material of colored.values()){
      if(material.userData.pbrKind!==kind)continue
      material.map=textures[0]
      material.normalMap=textures[1]
      // Poly Haven ARM maps pack roughness in the GREEN channel.
      material.roughnessMap=textures[2]
      material.needsUpdate=true
    }
  }).catch(()=>{
    // Offline-safe: do not replace working PBR maps with broken images.
  })
}
const defaults={
  cobble:{size:512,color:[122,122,115],noise:26,relief:.82,roughness:.9,metalness:0,repeat:[7,17]},
  agedWood:{size:512,color:[112,77,54],noise:36,relief:.68,roughness:.86,metalness:0,repeat:[3,2]},
  roofTile:{size:512,color:[67,70,71],noise:22,relief:.8,roughness:.72,metalness:.1,repeat:[8,6]},
  bamboo:{size:512,color:[74,111,65],noise:30,relief:.54,roughness:.72,metalness:0,repeat:[2,3]},
  asphalt:{size:512,color:[40,46,50],noise:20,relief:.26,roughness:.33,metalness:.16,repeat:[9,12]},
  stucco:{size:512,color:[190,177,154],noise:27,relief:.4,roughness:.95,metalness:0,repeat:[2,2]},
  bronze:{size:512,color:[107,78,54],noise:17,relief:.22,roughness:.48,metalness:.65,repeat:[2,3]},
  pavement:{size:512,color:[131,121,106],noise:23,relief:.66,roughness:.89,metalness:0,repeat:[8,16]},
  fabric:{size:512,color:[53,68,80],noise:20,relief:.32,roughness:.96,metalness:0,repeat:[3,3]},
  neon:{size:512,color:[35,40,68],noise:9,relief:.14,roughness:.22,metalness:.25,repeat:[2,1]}
}
const unit=(x)=>x-Math.floor(x)
const hash=(x,y,seed)=>unit(Math.sin(x*127.1+y*311.7+seed*71.9)*43758.5453123)
const lerp=(a,b,t)=>a+(b-a)*t
function noise(x,y,period,seed){
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy
  const a=fx*fx*(3-2*fx),b=fy*fy*(3-2*fy)
  const n=(i,j)=>hash((i%period+period)%period,(j%period+period)%period,seed)
  return lerp(lerp(n(ix,iy),n(ix+1,iy),a),lerp(n(ix,iy+1),n(ix+1,iy+1),a),b)
}
function fBm(u,v,seed){
  let t=0,total=0,amplitude=.5,period=4
  for(let i=0;i<5;i++){t+=amplitude*noise(u*period,v*period,period,seed+i*3);total+=amplitude;amplitude*=.5;period*=2}
  return t/total
}
const clamp=v=>Math.min(255,Math.max(0,Math.round(v)))
const smoothstep=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
function surface(kind,u,v){
  const n=fBm(u,v,11),f=fBm(u,v,29),q=noise(u*64,v*64,64,13)
  let height=n*.42+f*.12+q*.1,dark=1,variation=0
  if(kind==='agedWood'){
    const grain=Math.sin(u*2*Math.PI*37+f*9+n*4)
    const darkCrack=Math.pow(Math.max(0,Math.sin(u*Math.PI*2*9+v*Math.PI*2*.75+n*3)),26)
    height+=grain*.105-darkCrack*.17
    variation=grain*.1;dark-=darkCrack*.33
  }else if(kind==='roofTile'){
    const x=unit(u*9),y=unit(v*7)
    const gutter=1-smoothstep(.01,.075,Math.min(x,1-x))
    const row=1-smoothstep(.015,.09,Math.min(y,1-y))
    const bulb=Math.sin(x*Math.PI)*.18
    height+=bulb-gutter*.26-row*.2
    dark-=(gutter+row)*.28
  }else if(kind==='cobble'||kind==='pavement'){
    const cx=unit(u*8+(Math.floor(v*14)%2)*.5),cy=unit(v*14)
    const seamX=1-smoothstep(.018,.07,Math.min(cx,1-cx))
    const seamY=1-smoothstep(.016,.075,Math.min(cy,1-cy))
    const joints=Math.min(1,seamX+seamY)
    height+=.14-joints*.35
    dark-=joints*.46
    variation+=fBm(Math.floor(u*8)/8,Math.floor(v*14)/14,22)*.2
  }else if(kind==='bamboo'){
    const ring=1-smoothstep(.007,.028,Math.min(unit(v*8),1-unit(v*8)))
    height+=.05*Math.sin(u*2*Math.PI*18)+ring*.24
    dark-=ring*.14
  }else if(kind==='asphalt'){
    height=q*.4+f*.17
    variation+=(q-.5)*.24
  }else if(kind==='stucco'){
    height=f*.43+q*.2
  }else if(kind==='bronze'){
    variation+=(n-.5)*.2
    height+=f*.18
  }else if(kind==='fabric'){
    height+=Math.cos(u*2*Math.PI*58)*Math.cos(v*2*Math.PI*58)*.2
  }
  return {h:height,light:dark+(n-.5)*.25+variation}
}
function makeTextures(kind){
  const spec=defaults[kind]||defaults.stucco
  const size=spec.size,texels=size*size
  const heights=new Float32Array(texels),base=new Uint8Array(texels*4)
  const normals=new Uint8Array(texels*4),rough=new Uint8Array(texels*4)
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const i=y*size+x,{h,light}=surface(kind,x/size,y/size)
    heights[i]=h
    const shade=light*spec.noise
    for(let ch=0;ch<3;ch++)base[i*4+ch]=clamp(spec.color[ch]*light+shade*.45)
    base[i*4+3]=255
    const micro=hash(x,y,9)*9
    const r=clamp(spec.roughness*255+(micro-4)+(h-.5)*24)
    rough[i*4]=r;rough[i*4+1]=r;rough[i*4+2]=r;rough[i*4+3]=255
  }
  const strength=spec.relief*3.25
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const i=y*size+x
    const left=heights[y*size+(x+size-1)%size],right=heights[y*size+(x+1)%size]
    const up=heights[((y+size-1)%size)*size+x],down=heights[((y+1)%size)*size+x]
    const dx=(left-right)*strength,dz=(up-down)*strength
    const len=Math.hypot(dx,dz,1)
    normals[i*4]=clamp(128+127*dx/len)
    normals[i*4+1]=clamp(128+127*dz/len)
    normals[i*4+2]=clamp(128+127/len)
    normals[i*4+3]=255
  }
  function tex(data,color=false){
    const t=new THREE.DataTexture(data,size,size,THREE.RGBAFormat)
    t.colorSpace=color?THREE.SRGBColorSpace:THREE.NoColorSpace
    t.wrapS=t.wrapT=THREE.RepeatWrapping
    t.repeat.set(...spec.repeat)
    t.magFilter=THREE.LinearFilter
    t.minFilter=THREE.LinearMipmapLinearFilter
    t.generateMipmaps=true
    t.anisotropy=8
    t.needsUpdate=true
    return t
  }
  return {map:tex(base,true),normalMap:tex(normals),roughnessMap:tex(rough)}
}
export function materialPBR(kind,props={}){
  const id=kind+JSON.stringify(props)
  if(colored.has(id))return colored.get(id)
  if(!sources.has(kind))sources.set(kind,makeTextures(kind))
  const spec=defaults[kind]||defaults.stucco
  const m=new THREE.MeshPhysicalMaterial({
    ...sources.get(kind),
    roughness:1,
    metalness:spec.metalness,
    normalScale:new THREE.Vector2(.55,.55),
    clearcoat:kind==='asphalt'?.21:kind==='bronze'?.15:0,
    clearcoatRoughness:kind==='asphalt'?.24:.56,
    ...props
  })
  m.userData.persistentPBR=true
  m.userData.pbrKind=kind
  colored.set(id,m)
  if(scanned.has(kind)){
    const [diffuse,normal,arm]=scanned.get(kind)
    m.map=diffuse;m.normalMap=normal;m.roughnessMap=arm
    m.needsUpdate=true
  }else upgradeKindWithPhotoScans(kind)
  return m
}
export function environmentalMaterial(name){return materialPBR(name)}
export function setTextureQuality({anisotropy=8}={}){
  for(const set of sources.values())for(const t of Object.values(set))t.anisotropy=anisotropy
}
/** Dispose GPU textures once on app shutdown only, never on zone swaps. */
export function disposePBR(){
  for(const value of sources.values())for(const tex of Object.values(value))tex.dispose()
  for(const mat of colored.values())mat.dispose()
  for(const textures of scanned.values())for(const tex of textures)tex.dispose()
  scanned.clear();scansInFlight.clear();sources.clear();colored.clear()
}
