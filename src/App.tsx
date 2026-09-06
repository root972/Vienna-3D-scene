import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import environment foor scene (road)
import { createRoad, createTramRoute } from './three/environment/road'
import { createGround } from './three/environment/ground'
import { createTreeGroup } from './three/environment/tree'
import { createVienneseTram, updateVienneseTram } from './three/environment/tram'
//import  landamrk 3 parliment  
import { createParliament } from './three/environment/Parlament'
// import stephens export
import { createStephansdom } from './three/landmarks/stephansdom'
//impor pratersferrs wheel export ehre 
import {
  createPraterFerrisWheel,
  updatePraterFerrisWheel,
} from './three/landmarks/Prater-Ferriswheel'
// raycaster import for detecting  ouse stuff
import {
  createRaycaster,
  getIntersectedLandmark,
  updateLandmarkHighlights,
  type InteractiveLandmark,
} from './three/interaction/raycaster'
import InfoPanel from './components/InfoPanel'
import { LANDMARK_INFO, type LandmarkId } from './components/landmarkInfo'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [showInfo, setShowInfo] = useState(false)
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkId>('stephansdom')
  const selectedLandmarkRef = useRef<LandmarkId>('stephansdom')

  //  buton to comm wd Thre.js
  const exploreRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    // 1. The SCENE
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87ceeb)

    // 2. RAYCASTER
    const { raycaster, mouse } = createRaycaster()

    //  STEPHANs church scene 
    const stephansdom = createStephansdom()
    stephansdom.position.set(0, 0, 36)
    scene.add(stephansdom)
// praters feerreis wheel scene 
const prater = createPraterFerrisWheel()
  prater.position.set(39, 15, -28)
scene.add(prater)

//Environment scene  (raod)
const road = createRoad()
scene.add(road)

const tramRoute = createTramRoute()
const tram = createVienneseTram()
scene.add(tram)

const trees = createTreeGroup()
scene.add(trees)

//Landmark scene Parliment house 
const parliament = createParliament()
parliament.position.set(-24, 0, -16)
scene.add(parliament)

    const interactiveLandmarks: InteractiveLandmark[] = [
      { id: 'stephansdom', object: stephansdom },
      { id: 'prater', object: prater },
      { id: 'parliament', object: parliament },
    ]

    //  CAMERA
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    camera.position.set(0, 12, 62)

    //  Camera controlling..
    const controls = new OrbitControls(
      camera,
      canvas
    )

    controls.enableDamping = true
    controls.target.set(2, 3, 2)

    //  Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    })

    // creating shadow her
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    )

    //  ground scne 
    scene.add(createGround())

    //  Lighting fixing 
    // visualizing sun light her

    const sunLight =
      new THREE.DirectionalLight(
        0xffffff,
        1.7
      )

    
    // fixing ligt angle for lkong shadows 
    sunLight.position.set(
      -28,
      38,
      26
    )
    // brisghtness control 
  
    sunLight.castShadow = true
    sunLight.shadow.mapSize.set(1024, 1024)
    sunLight.shadow.bias = -0.0005
    sunLight.shadow.normalBias = 0.02

    sunLight.shadow.camera.left = -60
    sunLight.shadow.camera.right = 60
    sunLight.shadow.camera.top = 60
    sunLight.shadow.camera.bottom = -60
    sunLight.shadow.camera.near = 1
    sunLight.shadow.camera.far = 140

    scene.add(sunLight)

    const ambientLight =
      new THREE.AmbientLight(
        0xffffff,
        0.6
      )

    scene.add(ambientLight)

    // 9. camera movement sectin

    let isExploring = false

    const targetPosition = new THREE.Vector3()
    const targetLookAt = new THREE.Vector3()

    // react gaining access to this fxn
    exploreRef.current = () => {
      console.log('EXPLORE CLICKED')

      const landmark = LANDMARK_INFO[selectedLandmarkRef.current]
      targetPosition.set(
        landmark.cameraPosition.x,
        landmark.cameraPosition.y,
        landmark.cameraPosition.z
      )
      targetLookAt.set(
        landmark.lookAt.x,
        landmark.lookAt.y,
        landmark.lookAt.z
      )

      setShowInfo(false)

      isExploring = true
    }

    // mousr position

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      const rect =
        canvas.getBoundingClientRect()

      mouse.x =
        ((event.clientX - rect.left) /
          rect.width) *
          2 -
        1

      mouse.y =
        -(
          ((event.clientY - rect.top) /
            rect.height) *
            2 -
          1
        )
    }

    canvas.addEventListener(
      'mousemove',
      handleMouseMove
    )

    // clicking on da landmarks

    const handleClick = () => {
      const landmarkId = getIntersectedLandmark(
        raycaster,
        mouse,
        camera,
        interactiveLandmarks
      )

      if (landmarkId) {
        const selectedId = landmarkId as LandmarkId
        selectedLandmarkRef.current = selectedId
        setSelectedLandmark(selectedId)
        setShowInfo(true)
      }
    }

    canvas.addEventListener(
      'click',
      handleClick
    )

    // animation

    let animationId: number

    function animate(elapsedTime: number) {
      animationId =
        requestAnimationFrame(
          animate
        )

      updatePraterFerrisWheel(prater, elapsedTime / 1000)
      updateVienneseTram(tram, tramRoute, elapsedTime / 1000)

      updateLandmarkHighlights(
        raycaster,
        mouse,
        camera,
        interactiveLandmarks
      )

      // smothing camera moving around 
      if (isExploring) {
        camera.position.lerp(
          targetPosition,
          0.03
        )
        controls.target.lerp(targetLookAt, 0.03)

        if (
          camera.position.distanceTo(
            targetPosition
          ) < 0.1 &&
          controls.target.distanceTo(targetLookAt) < 0.1
        ) {
          camera.position.copy(
            targetPosition
          )
          controls.target.copy(targetLookAt)

          isExploring = false
        }
      }

      controls.update()

      renderer.render(
        scene,
        camera
      )
    }

    animate(0)

    //  claneing section

    return () => {
      cancelAnimationFrame(
        animationId
      )

      exploreRef.current = null

      canvas.removeEventListener(
        'mousemove',
        handleMouseMove
      )

      canvas.removeEventListener(
        'click',
        handleClick
      )

      controls.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} />

      <InfoPanel
        visible={showInfo}
        title={LANDMARK_INFO[selectedLandmark].title}
        description={LANDMARK_INFO[selectedLandmark].description}
        onClose={() =>
          setShowInfo(false)
        }
        onExplore={() =>
          exploreRef.current?.()
        }
      />
    </>
  )
}

export default App