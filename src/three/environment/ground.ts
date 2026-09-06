import * as THREE from 'three'

export function createGround(): THREE.Group {
  const group = new THREE.Group()

  const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x6f8f55,
    roughness: 1,
  })

  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    grassMaterial
  )
  base.rotation.x = -Math.PI / 2
  base.position.y = -1
  base.receiveShadow = true
  group.add(base)

  const lawnMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x78985d, roughness: 1 }),
    new THREE.MeshStandardMaterial({ color: 0x66854f, roughness: 1 }),
  ]

  const lawnPatches = [
    { x: -28, z: 18, width: 26, depth: 24 },
    { x: 27, z: 16, width: 24, depth: 22 },
    { x: 20, z: -12, width: 18, depth: 16 },
    { x: -35, z: -34, width: 22, depth: 18 },
  ]

  lawnPatches.forEach((patch, index) => {
    const lawn = new THREE.Mesh(
      new THREE.PlaneGeometry(patch.width, patch.depth),
      lawnMaterials[index % lawnMaterials.length]
    )
    lawn.rotation.x = -Math.PI / 2
    lawn.position.set(patch.x, -0.99, patch.z)
    lawn.receiveShadow = true
    group.add(lawn)
  })

  return group
}
