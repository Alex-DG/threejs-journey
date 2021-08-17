import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    console.log(child)

    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      //   child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.material.needsUpdate = true

      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 5
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials)

/**
 * Models
 */
// gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
gltfLoader.load("/models/hamburger.glb", (gltf) => {
  console.log("success")

  //   gltf.scene.scale.set(10, 10, 10)
  //   gltf.scene.position.set(0, -4, 0)
  //   gltf.scene.rotation.y = Math.PI * 0.5

  //   scene.add(gltf.scene)

  gltf.scene.scale.set(0.3, 0.3, 0.3)
  gltf.scene.position.set(0, -1, 0)
  scene.add(gltf.scene)

  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("rotation")

  updateAllMaterials()
})

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3)
directionalLight.castShadow = true

directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)

directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

directionalLight.shadow.normalBias = 0.05

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
)
scene.add(directionalLightCameraHelper)

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity")
gui
  .add(directionalLight.position, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("ligthX")

gui
  .add(directionalLight.position, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("ligthY")

gui
  .add(directionalLight.position, "z")
  .min(0)
  .max(10)
  .step(0.001)
  .name("ligthZ")

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
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
camera.position.set(4, 1, -4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.physicallyCorrectLights = true // Light

renderer.outputEncoding = THREE.sRGBEncoding // Textures encoding

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
  })

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001)

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
