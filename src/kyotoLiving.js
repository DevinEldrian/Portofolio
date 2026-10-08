import * as THREE from 'three'
import {rect,circle} from './collisionLogic.js'

/**
 * Connected stylized Arashiyama corridor, all positions in game units.
 * A geographically inspired WALK, not an exact-scale map or licensed model.
 * Randen (z -10), Sagano grove (north / negative z),
 * Kyoto street (z 0..45), Katsura promenade (z 50),
 * Togetsukyo and Katsura waterway (z 63..88).
 */
const material=(color,more={})=>new THREE.MeshStandardMaterial({color,roughness:.86,...more})
function box(g,x,y,z,w,h,d,color){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof color==='string'?material(color):color)
  m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m
}
function floor(g,x,z,w,d,color,y=.02){
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),typeof color==='string'?material(color):color)
  m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;g.add(m);return m
}
function pillar(g,x,y,z,r,h,color){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,8),material(color))
  m.position.set(x,y,z);m.castShadow=true;g.add(m);return m
}
function sphere(g,x,y,z,r,color){
  const m=new THREE.Mesh(new THREE.SphereGeometry(r,8,6),material(color))
  m.position.set(x,y,z);m.castShadow=true;g.add(m);return m
}
function signedBoard(g,label,x,y,z,w=9,h=2.25){
  const c=document.createElement('canvas');c.width=640;c.height=160
  const ctx=c.getContext('2d')
  if(!ctx)return
  ctx.fillStyle='#f7ecd4';ctx.fillRect(0,0,640,160)
  ctx.strokeStyle='#694934';ctx.lineWidth=14;ctx.strokeRect(7,7,626,146)
  ctx.fillStyle='#372f2e';ctx.textAlign='center'
  ctx.font='bold 43px sans-serif';ctx.fillText(label.slice(0,30),320,97)
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}))
  m.position.set(x,y,z);g.add(m);return m
}
function maple(g,x,z,seed){
  const h=7+seed*3
  pillar(g,x,h*.42,z,.45,h*.84,'#59463a')
  const warm=['#b75b38','#d27e3c','#e3a65a','#b54c38','#c97d45']
  for(let i=0;i<5;i++){
    const a=i*2.399+seed
    sphere(g,x+Math.cos(a)*1.4,h+Math.sin(i*3.1)*.9,z+Math.sin(a)*1.5,2.6,warm[(i+Math.floor(seed*5))%warm.length])
  }
}
function bamboo(g,x,z,height){
  const culm=material('#599071',{metalness:.08})
  const stalk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.23,height,7),culm)
  stalk.position.set(x,height*.5,z);g.add(stalk)
  for(let h=1;h<height;h+=2.1){
    const joint=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.13,7),material('#416d54'))
    joint.position.set(x,h,z);g.add(joint)
    if(h>height*.45){
      const crown=new THREE.Mesh(new THREE.ConeGeometry(.9,3.1,5),material(h%3>1?'#3c7958':'#539873'))
      crown.rotation.z=((x+z)%3-1)*.26
      crown.position.set(x+(h%2-.5)*.38,h+.28,z);g.add(crown)
    }
  }
}
function shop(g,x,z,label,type,index){
  const side=Math.sign(x)
  const facadeX=x-side*4.2
  const c=['#ba9a79','#b7a28c','#cfbba0','#a89475'][index%4]
  const wall=box(g,x,3.8,z,12,7.6,11,c);wall.userData.cameraBlocker=true
  // Extended dark sloped-eave silhouette, wooden slatted frontage.
  box(g,x,8.05,z,14.4,.8,13.2,'#444741')
  box(g,facadeX,3.4,z,1,6.6,10,'#473e37')
  box(g,facadeX-side*.6,4.5,z,1.4,2.6,7,material('#d7b17c',{emissive:'#956e37',emissiveIntensity:.16}))
  for(let j=-2;j<=2;j++)box(g,facadeX-side*1.35,4.4,z+j*1.65,.2,4.7,.15,'#694b37')
  const awning=box(g,facadeX-side*2,6,z,3.3,.3,11,type==='tea'?'#516f52':'#9c5245')
  awning.rotation.z=side*.1
  box(g,facadeX-side*2.1,1.6,z,3.1,1.05,9,'#71503d')
  const shopSign=signedBoard(g,label,facadeX-side*2.75,7.3,z,7.8,1.7)
  if(shopSign)shopSign.rotation.y=Math.PI/2
  // Goods: trays, fabric rolls, tea tins and wagashi boxes.
  for(let j=-2;j<=2;j++){
    const color=type==='tea'?['#63836b','#d9b278','#687b61'][Math.abs(j)%3]:['#d7a267','#cf7252','#d1b38a'][Math.abs(j)%3]
    box(g,facadeX-side*3.35,2.4,z+j*1.48,1.2,.62,1.18,color)
  }
  const noren=box(g,facadeX-side*2.7,5.4,z+4.3,.12,1.1,1.45,type==='tea'?'#446957':'#9d6655')
  noren.castShadow=false
}
function human(outfit='#425a66',pants='#36414a',skin='#deb998',scale=1){
  const group=new THREE.Group();group.scale.setScalar(scale)
  // Articulated human proportions and distinct clothing. No cylinder NPC placeholders.
  box(group,0,3,0,1.2,2,.65,outfit)
  sphere(group,0,4.65,0,.53,skin)
  const hair=sphere(group,0,4.97,-.08,.54,'#302d2b');hair.scale.y=.45
  const leftLeg=new THREE.Group(),rightLeg=new THREE.Group(),leftArm=new THREE.Group(),rightArm=new THREE.Group()
  for(const [leg,x] of [[leftLeg,-.31],[rightLeg,.31]]){
    leg.position.set(x,2.06,0);box(leg,0,-.75,0,.48,1.53,.55,pants);box(leg,0,-1.49,.12,.56,.22,.85,'#39322f');group.add(leg)
  }
  for(const [arm,x] of [[leftArm,-.82],[rightArm,.82]]){
    arm.position.set(x,3.75,0);box(arm,0,-.7,0,.42,1.35,.48,outfit);group.add(arm)
  }
  // Clothes and props increase silhouette readability without unlicensed art.
  const scarf=box(group,0,3.95,.15,1.12,.22,.72,'#c3ad8d')
  scarf.castShadow=false
  return {group,leftLeg,rightLeg,leftArm,rightArm}
}
const PEOPLE=[
  // NPC navigation stays on the public pedestrian lane, not inside
  // solid souvenir shop walls or the stationary Randen car.
  {x:6,z:-11,range:3,mode:'station',color:'#45586f',scale:1},
  {x:7,z:7,range:6,mode:'walk',color:'#895f55',scale:.93},
  {x:-13,z:17,range:0,mode:'vendor',color:'#556b59',scale:1},
  {x:-7,z:21,range:6,mode:'walk',color:'#8c6b61',scale:1.08},
  {x:7,z:41,range:6,mode:'walk',color:'#5a657f',scale:.95},
  {x:-13,z:50,range:0,mode:'photo',color:'#a17c59',scale:1},
  {x:0,z:-61,range:7,mode:'walk',color:'#6d7c62',scale:.97},
  {x:-7,z:-81,range:0,mode:'photo',color:'#626a73',scale:1.04}
]
export function createKyotoLiving(root,{reducedMotion=false}={}){
  const staticColliders=[]
  const g=new THREE.Group();g.name='ARASHIYAMA living town'
  root.add(g)
  floor(g,0,0,300,300,'#82926e')
  // Continuous human-scale public promenade: forest north, marketplace, river south.
  floor(g,0,-33,12,132,'#bcad90',.08)
  floor(g,0,28,17,68,'#b9aa90',.09)
  floor(g,0,50,66,18,'#bcb49d',.09)
  floor(g,0,98,13,26,'#aea79a',.14)
  floor(g,0,116,260,48,'#779875')
  // Katsura river flows east-west. Wide banks + flowing water plane.
  floor(g,0,74,300,36,'#73919a',.11)
  const water=floor(g,0,74,300,34,material('#5e95a5',{metalness:.16,roughness:.33}),.13)
  for(let x=-140;x<145;x+=11){
    const ripple=box(g,x,.16,70+(x%7),6,.013,.11,'#a3cbd0')
    ripple.material.transparent=true;ripple.material.opacity=.55
  }
  // Togetsukyo-inspired bridge: continuous crossing with support piers and parapets.
  box(g,0,.55,73,12,.45,53,'#a49b8e')
  // Low raised entry pads connect the promenade to the main bridge deck.
  box(g,0,.29,44.5,11.8,.25,5,'#a49b8e')
  box(g,0,.29,102,11.8,.25,5,'#a49b8e')
  for(let z=49;z<100;z+=5.2){
    for(const x of [-6.3,6.3]){
      pillar(g,x,1.65,z,.22,2.5,'#baac94')
      if(z%3<2)box(g,x,2.3,z,.2,.18,5.3,'#6f5c48')
    }
  }
  for(let z of [60,73,87])for(let x of [-3,3])pillar(g,x,-.15,z,1,3.2,'#807c72')
  // Local market with shop displays, original non-branded signs, shaded counters.
  const names=['KYOTO TEA','WAGASHI SWEETS','LOCAL CRAFTS','SOUVENIRS','MATCHA GARDEN','ARASHI TEXTILES']
  for(let j=0;j<6;j++){
    const z=3+j*8.3
    shop(g,-23,z,names[j],j%2?'sweets':'tea',j)
    shop(g,23,z+2,names[(j+3)%6],j%2?'tea':'sweets',j+1)
    staticColliders.push(rect(-22,z,16,11,'shop-west-'+j))
    staticColliders.push(rect(22,z+2,16,11,'shop-east-'+j))
  }
  // Destination markers aligned with connected paths.
  signedBoard(g,'KATSURA RIVER',-2,6.8,47,9.3,1.9)
  signedBoard(g,'SAGANO BAMBOO GROVE',0,7.6,-48,12,1.8)
  signedBoard(g,'TOGETSUKYO BRIDGE',-13,5,57,10,1.8)
  for(let z=-98;z<-47;z+=7){
    for(let side of [-1,1]){
      const x=side*(8.5+(Math.abs(z)%4))
      bamboo(g,x,z,13+Math.abs(z%5))
      bamboo(g,x+side*3.5,z+2.1,15+Math.abs(z%3))
      staticColliders.push(circle(x,z,.3,'bamboo'))
      staticColliders.push(circle(x+side*3.5,z+2.1,.3,'bamboo'))
    }
  }
  // Autumn maples near Randen arrival, shops, riverbank, low-frequency foliage.
  let rand=371
  const random=()=>{rand=(Math.imul(rand,1664525)+1013904223)>>>0;return rand/4294967296}
  for(let i=0;i<26;i++){
    const x=(random()-.5)*260,z=(random()-.5)*240
    const nearMarket=z>-10&&z<57&&Math.abs(x)<45
    const nearWalk=Math.abs(x)<13||z>53&&z<102
    if(!nearMarket&&!nearWalk){maple(g,x,z,random());staticColliders.push(circle(x,z,.5,'maple'))}
  }
  for(let i=0;i<18;i++){
    const x=-140+i*16
    const ridge=new THREE.Mesh(new THREE.ConeGeometry(18+random()*8,38+random()*31,7),material(i%2?'#73896c':'#627a66'))
    ridge.position.set(x,19,143);g.add(ridge)
  }
  // Small Randen-inspired purple tram shelter trim and textile light columns.
  signedBoard(g,'RANDEN ARASHIYAMA',18,10,-10,12,2.1)
  for(let i=0;i<7;i++){
    const z=-38+i*5.2
    box(g,8,2.5,z,.36,5,.38,material(i%2?'#dac89d':'#bc8d81',{emissive:'#6e4e6e',emissiveIntensity:.2}))
    box(g,8,5.1,z,1,.3,.9,'#504253')
  }
  // Water is not a walkable sidewalk. Crossing is only possible inside
  // the Togetsukyo bridge corridor; the southern bank stays accessible.
  staticColliders.push(rect(-53,74,94,36,'Katsura water west'))
  staticColliders.push(rect(53,74,94,36,'Katsura water east'))
  // Decorative gate pillars are solid; leave the center pedestrian path free.
  for(let i=0;i<7;i++)staticColliders.push(rect(8,-38+i*5.2,.36,.38,'Randen lights'))
  const npcs=PEOPLE.map((def,index)=>{
    const p=human(def.color,index%2?'#5f514c':'#3d4543','#ddbca4',def.scale)
    p.group.position.set(def.x,.1,def.z)
    if(def.mode==='vendor'){
      const tray=box(p.group,0,2.15,-.62,2.1,.16,.88,'#bd9465')
      tray.castShadow=false
      for(let k=-1;k<=1;k++)box(p.group,k*.58,2.38,-.62,.42,.25,.5,'#d8bd8e')
    }
    if(def.mode==='photo'){
      // Phone is carried in hand and raised during the photo idle beat.
      box(p.rightArm,0,-1.35,-.25,.35,.52,.15,'#333b42')
    }
    if(def.mode==='station'){
      // Route leaflet held by a waiting passenger.
      box(p.leftArm,0,-1.15,-.25,.5,.65,.08,'#efe4c9')
    }
    g.add(p.group)
    return {...p,def,index}
  })
  let lowPower=false
  const leaves=[]
  const leafGeo=new THREE.PlaneGeometry(.42,.6)
  const leafMat=material('#d68d48',{side:THREE.DoubleSide})
  for(let i=0;i<42;i++){
    const leaf=new THREE.Mesh(leafGeo,leafMat)
    const x=(random()-.5)*100,z=(random()-.5)*190
    leaf.position.set(x,.7+random()*11,z);leaf.rotation.set(random(),random(),random())
    g.add(leaf);leaves.push({leaf,baseX:x,baseZ:z,height:leaf.position.y,phase:random()*Math.PI*2})
  }
  // Geometry only once; opacity/material toggles distinguish weather states.
  const rainPositions=new Float32Array(150*3)
  for(let i=0;i<150;i++){
    rainPositions[i*3]=(random()-.5)*38
    rainPositions[i*3+1]=random()*22
    rainPositions[i*3+2]=(random()-.5)*47
  }
  const rainGeo=new THREE.BufferGeometry()
  rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPositions,3))
  const rain=new THREE.Points(rainGeo,new THREE.PointsMaterial({color:'#d7e6ed',size:.12,transparent:true,opacity:.65}))
  rain.visible=false;g.add(rain)
  let rainEnabled=false
  return {
    setPerformanceMode(value){
      lowPower=!!value
      for(const {leaf} of leaves)leaf.visible=!lowPower&&!reducedMotion
      rain.visible=!lowPower&&!reducedMotion&&rainEnabled
    },
    colliders:staticColliders,
    getDynamicColliders(){return npcs.map(n=>circle(n.group.position.x,n.group.position.z,.75,'pedestrian'))},
    setWeather(value){
      rainEnabled=value==='drizzle'
      rain.visible=rainEnabled&&!reducedMotion&&!lowPower
      water.material.color.set(rainEnabled?'#607d88':'#5e95a5')
    },
    update(dt,now,weather,player){
      const t=now*.001
      for(const {group,leftLeg,rightLeg,leftArm,rightArm,def,index} of npcs){
        const walking=def.mode==='walk'||def.mode==='station'
        const phase=t*.28+index*2.1
        const oscillation=walking?Math.sin(phase)*def.range:0
        const x=def.x+(index%2?Math.cos(phase):Math.sin(phase))*def.range*.38
        const z=def.z+oscillation
        // Keep NPCs from trapping the avatar around kiosk stations.
        const safe=Math.hypot(x-(player?.x??999),z-(player?.z??999))
        const avoidance=safe<2.4?(2.4-safe):0
        group.position.set(x+avoidance,.12,z)
        group.rotation.y=walking?(Math.cos(phase)>0?0:Math.PI):def.mode==='photo'?-.5:1.3
        const swing=walking&&!reducedMotion?Math.sin(t*3+index)*.5:0
        leftLeg.rotation.x=swing;rightLeg.rotation.x=-swing
        leftArm.rotation.x=def.mode==='station'?-0.6:-swing*.6
        rightArm.rotation.x=def.mode==='photo'?-1.25+Math.sin(t*.7+index)*.12:def.mode==='vendor'?-0.7+Math.sin(t*.9)*.18:swing*.6
      }
      if(!reducedMotion&&!lowPower){
        for(const {leaf,baseX,baseZ,height,phase} of leaves){
          leaf.position.x=baseX+Math.sin(t*.7+phase)*1.2
          leaf.position.z=baseZ+Math.cos(t*.6+phase)*1.1
          leaf.position.y=.3+((height-t*.35+phase*2)%13+13)%13
          leaf.rotation.y+=dt*.7
        }
        if(weather==='drizzle'){
          for(let i=0;i<150;i++){
            rainPositions[i*3+1]-=dt*11
            if(rainPositions[i*3+1]<0)rainPositions[i*3+1]=22
          }
          rain.position.set(player?.x||0,0,player?.z||0)
          rainGeo.attributes.position.needsUpdate=true
        }
      }
      water.material.roughness=weather==='drizzle'?.28:.33
    }
  }
}
