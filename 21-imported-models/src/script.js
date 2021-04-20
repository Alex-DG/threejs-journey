import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import * as dat from 'dat.gui'
import { traverseMaterials } from './utils/traverse'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 300 })

const parameters = {
  wireframe: false,
  floor: true,
  animations: {
    survey: true,
    walk: false,
    run: false,
    stop: false,
  },
  speed: 1,
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Model loaded
let content

// Animation mixer
let mixer
let activeAction, previousAction

// Actions
const ACTIONS = Object.freeze({
  SURVEY: 'survey',
  WALK: 'walk',
  RUN: 'run',
})

/**
 * Animation
 */

// Deactivates all previously scheduled actions on this mixer.
const stopAllActions = () => mixer?.stopAllAction()

const playAction = (name = ACTIONS.SURVEY) => {
  const animation = content.animations?.find(
    (a) => a.name.toLowerCase() === name
  )
  const action = mixer?.clipAction(animation)
  action.play()
}

const getAnimation = (name) => {
  return content.animations?.find((a) => a.name.toLowerCase() === name)
}

const stopActiveAction = (duration = 0.2) => {
  if (previousAction) {
    previousAction.fadeOut(duration)
  }
}

const fadeToAction = (name = ACTIONS.SURVEY, duration = 0.2) => {
  previousAction = activeAction

  const animation = getAnimation(name)
  activeAction = mixer?.clipAction(animation)

  if (previousAction && previousAction !== activeAction) {
    previousAction.fadeOut(duration).stop()
  }

  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play()
}

/**
 * Models
 */

// Instantiate model loader
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/') // faster version with webassembly

const gltfLoader = new GLTFLoader()

// glTF loader is setup with the draco loader which means
// if you load a draco file the draco loader will kick off, if it's a standard
// glTF file the glTF loader is smart enough to not load draco in that case when not needed
// gltfLoader.setDRACOLoader(dracoLoader)

// Megan - Binary
const meganModel = '/models/Megan/Megan.glb'

// Duck - many types!
const duckModelglTF = '/models/Duck/glTF/Duck.gltf'
const duckModelBinary = '/models/Duck/glTF-Binary/Duck.glb'
const duckModelDraco = '/models/Duck/glTF-Draco/Duck.gltf' // Need Draco loader!
const duckModelEmbedded = '/models/Duck/glTF-Embedded/Duck.gltf'

// Helmet - glTF
const helmetModel = '/models/FlightHelmet/glTF/FlightHelmet.gltf'

// Fox - many types!
const foxModelglTF = '/models/Fox/glTF/Fox.gltf'
const foxModelBinary = '/models/Fox/glTF-Binary/Fox.glb'
const foxModelDraco = '/models/Fox/glTF-Draco/Fox.gltf' // Need Draco loader!
const foxModelEmbedded = '/models/Fox/glTF-Embedded/Fox.gltf'

const loadModel = () => {
  gltfLoader.load(
    foxModelglTF,
    (gltf) => {
      content = gltf

      /**
       * Animations
       */
      const animations = content.animations

      mixer = new THREE.AnimationMixer(content.scene)

      if (animations?.length) {
        // playAction()
        fadeToAction()
      }

      /**
       * ::: Load model - Solution 1 :::
       */

      // To avoid to remove children (meshes) when moving them from
      // the model scene to our Three.js scene we have to duplicate the array
      // const children = [...gltf.scene.children]
      // for (const child of children) {
      //   scene.add(child)
      // }

      /**
       * ::: Load model - Solution 2 :::
       */

      // when needed set the scale before adding the model scene to our scene
      // here our fox would be too big without setting the scale
      content.scene.scale.set(0.025, 0.025, 0.025)

      scene.add(content.scene)
    },
    (xhr) => {
      console.log('progress...', { xhr })
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log('error!', { error })

      // alert(error.message)
    }
  )
}

loadModel()

/**
 * Floor
 */
let floor = null
let floorGeometry = null
let floorMaterial = null

const removeFloor = () => {
  if (floor !== null) {
    floorGeometry.dispose()
    floorMaterial.dispose()

    scene.remove(floor)
  }
}

const addFloor = () => {
  // Remove floor if it does already exist before adding it to the scene
  removeFloor()

  floorGeometry = new THREE.PlaneGeometry(10, 10)

  floorMaterial = new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5,
    transparent: true,
  })

  floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.receiveShadow = true
  floor.rotation.x = -Math.PI * 0.5

  scene.add(floor)
}

addFloor()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)

scene.add(ambientLight, directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
let controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)

/**
 * GUI
 */

const displayFolder = gui.addFolder('Display')
const lightningFolder = gui.addFolder('Lightning')
const animationFolder = gui.addFolder('Animation')

displayFolder.add(parameters, 'wireframe').onChange((value) => {
  traverseMaterials(content.scene, (material) => {
    material.wireframe = value
  })
})
displayFolder.add(controls, 'autoRotate')
displayFolder.add(controls, 'autoRotateSpeed').min(1).max(20).step(1)
displayFolder.add(parameters, 'floor').onChange((value) => {
  if (value) {
    addFloor()
  } else {
    removeFloor()
  }
})

lightningFolder
  .add(ambientLight, 'intensity')
  .min(0)
  .max(6)
  .step(0.1)
  .name('ambientIntensity')
lightningFolder
  .add(directionalLight, 'intensity')
  .min(0)
  .max(6)
  .step(0.1)
  .name('directIntensity')

const setCheckedAction = (name = 'stop') => {
  for (let param in parameters.animations) {
    parameters.animations[param] = false
  }
  parameters.animations[name] = true
}

// Radio button  behaviour
animationFolder
  .add(parameters.animations, ACTIONS.SURVEY)
  .listen()
  .onChange((value) => {
    // stopAllActions()
    setCheckedAction(ACTIONS.SURVEY)
    if (value) {
      fadeToAction(ACTIONS.SURVEY)
    }
  })
animationFolder
  .add(parameters.animations, ACTIONS.WALK)
  .listen()
  .onChange((value) => {
    // stopAllActions()
    setCheckedAction(ACTIONS.WALK)
    if (value) fadeToAction(ACTIONS.WALK)
  })
animationFolder
  .add(parameters.animations, ACTIONS.RUN)
  .listen()
  .onChange((value) => {
    // stopAllActions()
    setCheckedAction(ACTIONS.RUN)
    if (value) fadeToAction(ACTIONS.RUN)
  })
animationFolder
  .add(parameters.animations, 'stop')
  .listen()
  .onChange((value) => {
    setCheckedAction()
    parameters.animations.stop = value
    stopAllActions()
  })
  .name('stop all')

// Alternative solution: checkbox behaviour
// animationFolder.add(parameters, ACTIONS.SURVEY).onChange((value) => {
//   stopAllActions()
//   if (value) playAction(ACTIONS.SURVEY)
// })
// animationFolder.add(parameters, ACTIONS.WALK).onChange((value) => {
//   stopAllActions()
//   if (value) playAction(ACTIONS.WALK)
// })
// animationFolder.add(parameters, ACTIONS.RUN).onChange((value) => {
//   stopAllActions()
//   if (value) playAction(ACTIONS.RUN)
// })

animationFolder
  .add(parameters, 'speed')
  .min(0)
  .max(2)
  .step(0.1)
  .onChange((value) => {
    mixer.timeScale = value
  })

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  // clock.getDeltaTime()

  // How much seconds were spent since the last tick!
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update mixer
  mixer?.update(deltaTime)

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
