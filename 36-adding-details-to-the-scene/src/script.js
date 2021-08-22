import "./style.css"
import * as dat from "dat.gui"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"

import firefliesVertexShader from "./shaders/fireflies/vertex.glsl"
import firefliesFragmentShader from "./shaders/fireflies/fragment.glsl"

import portalVertexShader from "./shaders/portal/vertex.glsl"
import portalFragmentShader from "./shaders/portal/fragment.glsl"

/**
 * Base
 */
// Debug
const debugObject = {}
const gui = new dat.GUI({
  width: 400,
})

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("draco/")

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load("baked.jpg")
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

debugObject.portalColorStart = "#000000"
debugObject.portalColorEnd = "#ffffff"

gui.addColor(debugObject, "portalColorStart").onChange(() => {
  portalLightMaterial.uniforms.uColorStart.value.set(
    debugObject.portalColorStart
  )
})

gui.addColor(debugObject, "portalColorEnd").onChange(() => {
  portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
})
// Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
    uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) },
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
})

/**
 * Model
 */
gltfLoader.load("portal.glb", (gltf) => {
  scene.add(gltf.scene)

  // Get each object
  const bakedMesh = gltf.scene.children.find((child) => child.name === "baked")
  const portalLightMesh = gltf.scene.children.find(
    (child) => child.name === "portalLight"
  )
  const poleLightAMesh = gltf.scene.children.find(
    (child) => child.name === "poleLightA"
  )
  const poleLightBMesh = gltf.scene.children.find(
    (child) => child.name === "poleLightB"
  )

  // Apply materials
  bakedMesh.material = bakedMaterial
  portalLightMesh.material = portalLightMaterial
  poleLightAMesh.material = poleLightMaterial
  poleLightBMesh.material = poleLightMaterial
})

/**
 * Fireflies / particles
 */

// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 60
const positionArray = new Float32Array(firefliesCount * 3)

const scaleArray = new Float32Array(firefliesCount) // add scale randomness

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
  positionArray[i * 3 + 1] = Math.random() * 1.5
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4

  scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
)
firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
)

// Material
// const firefliesMaterial = new THREE.PointsMaterial({
//   size: 0.1,
//   sizeAttenuation: true,
// })
const firefliesMaterial = new THREE.ShaderMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 100 },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
})

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

// Debug fireflies points size
gui
  .add(firefliesMaterial.uniforms.uSize, "value")
  .min(0)
  .max(500)
  .step(1)
  .name("firefliesSize")

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

  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  )
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
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
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Debug - scene background
debugObject.clearColor = "#201919"
renderer.setClearColor(debugObject.clearColor)
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update materials
  firefliesMaterial.uniforms.uTime.value = elapsedTime

  //   const blinkValue = Math.abs(Math.sin(elapsedTime * 0.7) * 100.0)
  //   firefliesMaterial.uniforms.uSize.value = blinkValue > 50 ? blinkValue : 50
  //   console.log(blinkValue)

  portalLightMaterial.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
