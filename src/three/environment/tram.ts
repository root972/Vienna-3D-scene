import * as THREE from 'three'

const redMaterial = new THREE.MeshStandardMaterial({
  color: 0xC82323,
  roughness: 0.7,
})

const creamMaterial = new THREE.MeshStandardMaterial({
  color: 0xF2F0E6,
  roughness: 0.8,
})

const windowMaterial = new THREE.MeshStandardMaterial({
  color: 0x1E252B,
  roughness: 0.2,
  metalness: 0.1,
})

const roofMaterial = new THREE.MeshStandardMaterial({
  color: 0xB9BEC2,
  roughness: 0.7,
  metalness: 0.3,
})

const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0x555D63,
  roughness: 0.35,
  metalness: 0.8,
})

const headlightMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFF3B0,
  emissive: 0xFFF3B0,
  emissiveIntensity: 1.5,
})

let tramCycleStartTime: number | null = null
let tramPauseStartedAt: number | null = null

export function createVienneseTram(): THREE.Group {
  const tram = new THREE.Group()

  const lowerBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.7, 0.9),
    redMaterial
  )
  lowerBody.position.y = 0.65
  lowerBody.castShadow = true
  tram.add(lowerBody)

  const upperBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.45, 0.55, 0.88),
    creamMaterial
  )
  upperBody.position.y = 1.28
  upperBody.castShadow = true
  tram.add(upperBody)

  const windows = new THREE.Mesh(
    new THREE.BoxGeometry(2.7, 0.3, 0.03),
    windowMaterial
  )
  windows.position.set(0, 1.35, 0.46)
  windows.castShadow = true
  tram.add(windows)

  const oppositeWindows = windows.clone()
  oppositeWindows.position.z = -0.46
  tram.add(oppositeWindows)

  const frontWindow = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.3, 0.65),
    windowMaterial
  )
  frontWindow.position.set(1.74, 1.35, 0)
  tram.add(frontWindow)

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.12, 0.82),
    roofMaterial
  )
  roof.position.y = 1.64
  roof.castShadow = true
  tram.add(roof)

  const pantographLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.55, 0.08),
    metalMaterial
  )
  pantographLeft.position.set(-0.45, 1.98, -0.2)
  pantographLeft.rotation.z = -0.5
  tram.add(pantographLeft)

  const pantographRight = pantographLeft.clone()
  pantographRight.position.z = 0.2
  pantographRight.rotation.z = 0.5
  tram.add(pantographRight)

  const pantographTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.48),
    metalMaterial
  )
  pantographTop.position.set(-0.45, 2.22, 0)
  tram.add(pantographTop)

  const headlight = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.14, 0.22),
    headlightMaterial
  )
  headlight.position.set(1.81, 0.58, 0)
  tram.add(headlight)

  for (const side of [-1, 1]) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.08, 10),
      metalMaterial
    )
    wheel.rotation.x = Math.PI / 2
    wheel.position.set(0.9, 0.05, side * 0.48)
    tram.add(wheel)
  }

  return tram
}

export function updateVienneseTram(
  tram: THREE.Group,
  route: THREE.CatmullRomCurve3,
  elapsedTime: number
) {
  const stopAt = 0.85
  const pauseDuration = 2.5
  const easingWindow = 0.15

  if (tramCycleStartTime === null) {
    tramCycleStartTime = elapsedTime
  }

  const rawProgress = ((elapsedTime - tramCycleStartTime) * 0.012) % 1
  let progress: number

  if (rawProgress < stopAt) {
    const easingStart = stopAt - easingWindow
    if (rawProgress <= easingStart) {
      progress = rawProgress
    } else {
      // Cubic ease-out reduces the travel rate smoothly as the tram parks.
      const t = (rawProgress - easingStart) / easingWindow
      const eased = 1 - Math.pow(1 - t, 3)
      progress = easingStart + easingWindow * eased
    }
  } else {
    if (tramPauseStartedAt === null) {
      tramPauseStartedAt = elapsedTime
    }

    if (elapsedTime - tramPauseStartedAt >= pauseDuration) {
      tramCycleStartTime = elapsedTime
      tramPauseStartedAt = null
      progress = 0
    } else {
      progress = stopAt
    }
  }

  tram.visible = progress > 0.02

  
  const point = route.getPointAt(progress)
  const tangent = route.getTangentAt(progress)

  tram.position.set(point.x, point.y - 0.7, point.z)
  tram.rotation.y = Math.atan2(-tangent.z, tangent.x)
}
