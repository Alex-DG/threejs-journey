import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */
// Basic example:
// const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32)
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// })

// // Points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)

// scene.add(particles)

// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000 // particles count!

// Multiply by 3 because each position is composed of 3 values (x, y, z)
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  // Math.random() - 0.5 to have a random value between -0.5 and +0.5
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}

// Create the Three.js BufferAttribute and specify that each information is composed of 3 values
particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true
// particlesMaterial.color = new THREE.Color('red')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particlesTexture
// particlesMaterial.alphaMap = 0.001
// particlesMaterial.depthTest = false // wont work if you have others things in your scene like another white cube
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)

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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Updates particles
  //   particles.rotation.y = elapsedTime * 0.2

  for (let i = 0; i < count; i++) {
    let i3 = i * 3 // (x,y,z) so => x = i3 and y = i3 + 1 = and z = i3 + 2

    // Array of particles:
    // particlesGeometry.attributes.position.array

    const x = particlesGeometry.attributes.position.array[i3]
    const y = i3 + 1

    particlesGeometry.attributes.position.array[y] = Math.sin(elapsedTime + x)
  }
  particlesGeometry.attributes.position.needsUpdate = true

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
