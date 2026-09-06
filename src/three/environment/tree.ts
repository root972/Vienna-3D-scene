import * as THREE from 'three'

const trunkMaterial = new THREE.MeshStandardMaterial({
  color: 0x76513a,
  roughness: 1,
})

const foliageMaterials = [
  new THREE.MeshStandardMaterial({ color: 0x3f6f45, roughness: 1 }),
  new THREE.MeshStandardMaterial({ color: 0x4f7e4d, roughness: 1 }),
]

export function createTree(scale = 1): THREE.Group {
  const tree = new THREE.Group()

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.38, 2.8, 6),
    trunkMaterial
  )
  trunk.position.y = 1.4
  trunk.castShadow = true
  tree.add(trunk)

  const lowerFoliage = new THREE.Mesh(
    new THREE.ConeGeometry(1.65, 2.5, 7),
    foliageMaterials[0]
  )
  lowerFoliage.position.y = 3.1
  lowerFoliage.castShadow = true
  tree.add(lowerFoliage)

  const upperFoliage = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 2.2, 7),
    foliageMaterials[1]
  )
  upperFoliage.position.y = 4.8
  upperFoliage.castShadow = true
  tree.add(upperFoliage)

  tree.scale.setScalar(scale)
  return tree
}

export function createTreeGroup(): THREE.Group {
  const group = new THREE.Group()
  const trees = [
    { x: -42, z: 24, scale: 0.95 },
    { x: -28, z: 31, scale: 1.1 },
    { x: 25, z: 34, scale: 0.9 },
    { x: -43, z: -5, scale: 1.05 },
    { x: -42, z: -34, scale: 0.9 },
    { x: -8, z: -42, scale: 1.1 },
    { x: 46, z: -8, scale: 0.95 },
    { x: 46, z: -42, scale: 1.08 },
    { x: 5, z: 6, scale: 0.88 },
  ]

  trees.forEach(({ x, z, scale }) => {
    const tree = createTree(scale)
    tree.position.set(x, -1, z)
    group.add(tree)
  })

  return group
}
