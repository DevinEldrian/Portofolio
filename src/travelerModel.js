import * as THREE from 'three'
import {materialPBR} from './pbrMaterials.js'

const skin=new THREE.MeshPhysicalMaterial({color:'#c89275',roughness:.67,metalness:0,
  sheen:0.23,sheenColor:'#d7a687',sheenRoughness:.7})
const hairMat=new THREE.MeshStandardMaterial({color:'#29252a',roughness:.88})
const jacket=materialPBR('fabric',{color:'#4b5362',roughness:1})
const trousers=materialPBR('fabric',{color:'#2e3948',roughness:1})
const black=new THREE.MeshStandardMaterial({color:'#171d23',roughness:.72})
const white=new THREE.MeshPhysicalMaterial({color:'#ded9cc',roughness:.62})
function ellipsoid(g,radii,position,m){
  const o=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),m)
  o.scale.set(...radii);o.position.set(...position);o.castShadow=true;g.add(o);return o
}
function cylinder(g,top,bottom,height,position,m,segments=18){
  const o=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,height,segments),m)
  o.position.set(...position);o.castShadow=true;g.add(o);return o
}
/**
 * Smooth high-segment traveler silhouette, not a block-body game mascot.
 * Consistent humanoid proportions; animation groups retain the legacy
 * walking API pending an approved licensed rigged GLB character.
 */
export function makeTraveler(){
  const g=new THREE.Group();g.name='KISEKI traveler · mesh prototype'
  const legA=new THREE.Group(),legB=new THREE.Group(),armA=new THREE.Group(),armB=new THREE.Group()
  // Jacket taper and layered hem form a readable garment silhouette.
  const shape=[
    [.43,0],[.56,.18],[.6,.52],[.62,1.1],[.67,1.65],[.72,1.93],
    [.51,2.28],[.39,2.38]
  ].map(([r,y])=>new THREE.Vector2(r,y))
  const jacketMesh=new THREE.Mesh(new THREE.LatheGeometry(shape,24),jacket)
  jacketMesh.position.y=2.48;jacketMesh.castShadow=true;g.add(jacketMesh)
  ellipsoid(g,[.37,.2,.22],[0,4.72,-.1],white) // shirt under collar
  // Waist belt and cinch.
  cylinder(g,.57,.55,.14,[0,2.74,0],black)
  // Backpack has rounded leather/nylon volume, straps, piping.
  ellipsoid(g,[.54,.89,.39],[0,3.68,.59],materialPBR('fabric',{color:'#292f3d'}))
  ellipsoid(g,[.39,.47,.41],[0,3.16,.86],black)
  for(const sx of [-1,1]){
    const strap=cylinder(g,.1,.08,1.55,[sx*.46,3.98,-.29],materialPBR('agedWood',{color:'#292e34'}),10)
    strap.rotation.z=sx*.14
  }
  // Neck and face, natural oval shapes and discrete facial contours.
  cylinder(g,.28,.31,.48,[0,5.03,0],skin)
  ellipsoid(g,[.42,.55,.39],[0,5.48,-.04],skin)
  for(const sx of [-1,1]){
    ellipsoid(g,[.085,.18,.12],[sx*.41,5.49,-.04],skin)
    ellipsoid(g,[.062,.027,.014],[sx*.18,5.5,-.415],black)
    ellipsoid(g,[.15,.033,.025],[sx*.19,5.64,-.4],hairMat)
  }
  ellipsoid(g,[.12,.16,.18],[0,5.36,-.39],skin)
  ellipsoid(g,[.17,.025,.02],[0,5.16,-.39],new THREE.MeshStandardMaterial({color:'#8f5954',roughness:.8}))
  ellipsoid(g,[.44,.30,.43],[0,5.85,.03],hairMat)
  for(let i=0;i<7;i++){
    const x=(i-3)*.118
    const tuft=ellipsoid(g,[.12,.18,.25],[x,5.93,-.22],hairMat)
    tuft.rotation.z=(i-3)*.1
  }
  // Articulated limbs: tapered rounded surfaces, not square cylinders.
  for(const [leg,sx] of [[legA,-1],[legB,1]]){
    leg.position.set(sx*.32,2.64,0)
    cylinder(leg,.26,.22,1.3,[0,-.7,.02],trousers)
    ellipsoid(leg,[.27,.32,.28],[0,-1.32,.05],trousers)
    cylinder(leg,.2,.17,1.02,[0,-1.89,.04],trousers)
    const shoe=ellipsoid(leg,[.29,.18,.49],[0,-2.43,-.14],white)
    shoe.rotation.x=.09
    ellipsoid(leg,[.29,.065,.47],[0,-2.57,-.14],black)
    g.add(leg)
  }
  for(const [arm,sx] of [[armA,-1],[armB,1]]){
    arm.position.set(sx*.73,4.61,0)
    ellipsoid(arm,[.28,.34,.3],[0,-.18,0],jacket)
    const sleeve=cylinder(arm,.24,.19,1.65,[sx*.06,-.94,0],jacket)
    sleeve.rotation.z=sx*.11
    ellipsoid(arm,[.18,.22,.19],[sx*.13,-1.88,-.08],skin)
    g.add(arm)
  }
  return {g,legA,legB,armA,armB}
}
