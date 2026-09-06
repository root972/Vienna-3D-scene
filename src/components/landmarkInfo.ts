export type LandmarkId = 'stephansdom' | 'prater' | 'parliament'

export const LANDMARK_INFO: Record<LandmarkId, {
  title: string
  description: string
  cameraPosition: { x: number; y: number; z: number }
  lookAt: { x: number; y: number; z: number }
}> = {
  stephansdom: {
    title: "St. Stephen's Cathedral",
    description: "One of Vienna's most recognizable landmarks, located in the heart of the city.",
    cameraPosition: { x: 0, y: 10, z: 54 },
    lookAt: { x: 0, y: 4, z: 36 },
  },
  prater: {
    title: 'Vienna Giant Ferris Wheel',
    description: 'One of Vienna\'s most iconic landmarks, the Giant Ferris Wheel has stood in the Prater since 1897 and offers panoramic views over the city.',
    cameraPosition: { x: 32, y: 12, z: -6 },
    lookAt: { x: 32, y: 7, z: -28 },
  },
  parliament: {
    title: 'Austrian Parliament',
    description: "One of Vienna's most recognizable historic buildings, the Austrian Parliament is known for its classical architecture and prominent columns.",
    cameraPosition: { x: -24, y: 9, z: -2 },
    lookAt: { x: -24, y: 3, z: -16 },
  },
}
