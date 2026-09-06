import * as THREE from 'three'

export type InteractiveLandmark = {
  id: string
  object: THREE.Object3D
}

export function createRaycaster() {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  return {
    raycaster,
    mouse,
  }
}

export function getIntersectedLandmark(
  raycaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  camera: THREE.Camera,
  landmarks: InteractiveLandmark[]
) {
  raycaster.setFromCamera(mouse, camera)

  return landmarks.find(({ object }) =>
    raycaster.intersectObject(object, true).length > 0
  )?.id ?? null
}

export function updateLandmarkHighlights(
  raycaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  camera: THREE.Camera,
  landmarks: InteractiveLandmark[]
) {
  raycaster.setFromCamera(mouse, camera)

  for (const { object } of landmarks) {
    const isHovered = raycaster.intersectObject(object, true).length > 0

    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.emissive.set(isHovered ? 0x333333 : 0x000000)
      }
    })
  }
}