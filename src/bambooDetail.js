import * as THREE from 'three'
/**
 * Real mesh leaves rather than primitive fir-tree cones.
 * Each leaf is a double-sided, curved lanceolate polygon. GPU instancing
 * keeps dense Sugano/Sagano grove crowns inexpensive for maximum settings.
 */
export function addBambooCrownGeometry(group,culms,{leavesPerStem=36}={}){
  const positions=new Float32Array([
    0,0,0, -.13,.23,.07, 0,.42,.12, .13,.23,.07,
    0,.42,.12,-.23,.69,.17,0,1.06,.08,.23,.69,.17
  ])
  const indices=new Uint16Array([0,1,2,0,2,3,2,4,5,2,5,6])
  const g=new THREE.BufferGeometry()
  g.setAttribute('position',new THREE.BufferAttribute(positions,3))
  g.setIndex(new THREE.BufferAttribute(indices,1))
  g.computeVertexNormals()
  const leaf=new THREE.MeshPhysicalMaterial({color:'#4f815c',side:THREE.DoubleSide,
    roughness:.75,metalness:0,clearcoat:.05})
  const mesh=new THREE.InstancedMesh(g,leaf,culms.length*leavesPerStem)
  const dummy=new THREE.Object3D()
  let seed=0x6a6fc35
  const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
  let i=0
  for(const {x,z,height} of culms){
    for(let j=0;j<leavesPerStem;j++){
      const a=rand()*Math.PI*2
      const extent=.4+rand()*3.5
      const h=height*(.57+rand()*.44)
      dummy.position.set(x+Math.cos(a)*extent,h,z+Math.sin(a)*extent)
      dummy.rotation.set((rand()-.5)*.7,a,(rand()-.5)*1.1)
      const s=.65+rand()*.8
      dummy.scale.set(s,s*(1+rand()*.9),s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i++,dummy.matrix)
      const shade=rand()
      mesh.setColorAt(i-1,new THREE.Color().setHSL(.3+shade*.045,.26+shade*.21,.28+shade*.2))
    }
  }
  mesh.instanceMatrix.needsUpdate=true
  mesh.frustumCulled=false
  mesh.castShadow=false;mesh.receiveShadow=true
  group.add(mesh)
  return mesh
}
