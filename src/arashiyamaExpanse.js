import * as THREE from 'three'
import {materialPBR} from './pbrMaterials.js'
import {addBambooCrownGeometry} from './bambooDetail.js'
import {circle} from './collisionLogic.js'

const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
/** Additional connected terrain beyond the initial Randen/river blockout.
 * This deliberately is NOT a disconnected floating island. Visible grounds
 * extend to 540m and the Sagano corridor continues north of z=-100.
 */
export function extendArashiyama(root){
  const r=rng(1326)
  const group=new THREE.Group()
  group.name='Arashiyama wider river valley and deep Sagano path'
  root.add(group)
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(540,540),materialPBR('stucco',{color:'#698d69'}))
  ground.rotation.x=-Math.PI/2;ground.position.y=.003
  ground.receiveShadow=true;group.add(ground)
  const path=new THREE.Mesh(new THREE.PlaneGeometry(10.5,158),materialPBR('cobble'))
  path.rotation.x=-Math.PI/2
  path.position.set(0,.07,-173)
  path.receiveShadow=true;group.add(path)
  const foliage=[],colliders=[]
  const stalks=1250,geo=new THREE.CylinderGeometry(.13,.17,1,9)
  const trunks=new THREE.InstancedMesh(geo,materialPBR('bamboo'),stalks)
  const dummy=new THREE.Object3D()
  for(let i=0;i<stalks;i++){
    const side=i%2===0?-1:1
    const x=side*(7+r()*53),z=-105-r()*133,h=12+r()*14
    dummy.position.set(x,h*.5+.12,z)
    dummy.scale.set(1,h,1);dummy.rotation.set(0,0,0)
    dummy.updateMatrix()
    trunks.setMatrixAt(i,dummy.matrix)
    foliage.push({x,z,height:h})
    if(Math.abs(x)<8.4)colliders.push(circle(x,z,.25,'bamboo-grove'))
  }
  trunks.instanceMatrix.needsUpdate=true
  trunks.castShadow=true;trunks.receiveShadow=true;group.add(trunks)
  addBambooCrownGeometry(group,foliage,{leavesPerStem:17})
  // North exit landscape continues behind the grove; do not end in a void.
  const slopeMaterial=materialPBR('stucco',{color:'#6e7d68'})
  for(let i=0;i<18;i++){
    const x=-245+i*28
    const mount=new THREE.Mesh(new THREE.SphereGeometry(1,12,9),slopeMaterial)
    mount.position.set(x,-17,-258-r()*12)
    mount.scale.set(23+r()*21,30+r()*27,29+r()*17)
    mount.receiveShadow=true;group.add(mount)
  }
  // River embankment continuation is visible beyond the original 300m water.
  const water=new THREE.Mesh(new THREE.PlaneGeometry(540,35),
    new THREE.MeshPhysicalMaterial({color:'#668f9c',roughness:.21,metalness:.38,clearcoat:1}))
  water.rotation.x=-Math.PI/2
  water.position.set(0,.093,74)
  water.receiveShadow=true;group.add(water)
  return {colliders,extentM:540,bambooStems:stalks}
}
