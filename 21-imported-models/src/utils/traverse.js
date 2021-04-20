/**
 * Three.js Object3D.traverse
 * https://threejs.org/docs/#api/en/core/Object3D.traverse
 */

/**
 * Update materials
 * @param {*} object
 * @param {*} callback
 */
export const traverseMaterials = (object, callback) => {
  object.traverse((node) => {
    // Looking for node type mesn
    if (!node.isMesh) return

    // Material(s) to update
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material]

    // Update material send in the callback
    materials.forEach(callback)
  })
}
