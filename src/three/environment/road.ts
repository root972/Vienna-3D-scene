import * as THREE from 'three'

export function createTramRoute(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(18, 0, 50),
    new THREE.Vector3(16, 0, 40),
    new THREE.Vector3(14, 0, 18),
    new THREE.Vector3(16, 0, 8),
    new THREE.Vector3(10, 0, 0),
    
    new THREE.Vector3(-4, 0, -6),
    new THREE.Vector3(-10, 0, -4),
    new THREE.Vector3(0, 0, -10),
    new THREE.Vector3(15, 0, -25),
    new THREE.Vector3(-2, 0, -26),
    new THREE.Vector3(32, 0, -28),
  ], false, 'centripetal')
}

export function createRoad(): THREE.Group {
  const group = new THREE.Group()

  const trackbedMaterial = new THREE.MeshStandardMaterial({
    color: 0x2A2C2F,
    roughness: 0.8,
  })

  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0xC0C6CE,
    metalness: 0.85,
    roughness: 0.2,
  })

  const grooveMaterial = new THREE.MeshStandardMaterial({
    color: 0x1A1B1C,
    roughness: 0.9,
  })

  const curbMaterial = new THREE.MeshStandardMaterial({
    color: 0x5b5a54,
  })

  const route = createTramRoute()


  const addProfile = (shape: THREE.Shape, material: THREE.Material) => {
    const mesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, {
        extrudePath: route,
        steps: 128,
        bevelEnabled: false,
      }),
      material
    )
    mesh.position.y = -0.85
    mesh.receiveShadow = true
    mesh.castShadow = material === railMaterial
    group.add(mesh)
  }

  const routePoints = route.getPoints(200)
  const worldUp = new THREE.Vector3(0, 1, 0)

  const createRibbon = (width: number, y: number, material: THREE.Material) => {
    const vertices: number[] = []
    const indices: number[] = []

    routePoints.forEach((point, index) => {
      const previous = routePoints[Math.max(0, index - 1)]
      const next = routePoints[Math.min(routePoints.length - 1, index + 1)]
      const tangent = next.clone().sub(previous).normalize()
      const side = new THREE.Vector3().crossVectors(tangent, worldUp).normalize()

      vertices.push(
        point.x + side.x * width / 2, y, point.z + side.z * width / 2,
        point.x - side.x * width / 2, y, point.z - side.z * width / 2
      )

      if (index < routePoints.length - 1) {
        const vertex = index * 2
        indices.push(vertex, vertex + 2, vertex + 1, vertex + 1, vertex + 3, vertex + 2)
      }
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    const ribbon = new THREE.Mesh(geometry, material)
    ribbon.receiveShadow = true
    group.add(ribbon)
  }

  const rectangle = (left: number, bottom: number, right: number, top: number) => {
    const shape = new THREE.Shape()
    shape.moveTo(left, bottom)
    shape.lineTo(right, bottom)
    shape.lineTo(right, top)
    shape.lineTo(left, top)
    shape.closePath()
    return shape
  }

  
  createRibbon(4.8, -0.76, trackbedMaterial)
  createRibbon(5.4, -0.75, curbMaterial)

  addProfile(rectangle(-0.46, 0.1, -0.34, 0.13), railMaterial)
  addProfile(rectangle(0.34, 0.1, 0.46, 0.13), railMaterial)
  addProfile(rectangle(-0.52, 0.1, -0.46, 0.105), grooveMaterial)
  addProfile(rectangle(0.46, 0.1, 0.52, 0.105), grooveMaterial)

  return group
}