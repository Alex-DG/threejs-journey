
/*

MATRICES:

`modelMatrix`
-> will apply all transformations relative to the Mesh. If we scale, rotate
or move the Mesh, these transformations will be contained in the modelMatrix
and applied to the position.

`viewMatrix`
-> will apply transformations relative to the camera. If we rotate the camera
to the left, the vertices should be on the right. If we move the camera in
direction of the Mesh, the vertices should get bigger, etc.

`projectionMatrix`
-> will finally transform our coordinates into the final clip space coordinates.

*/
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 uFrequency; // custom uniform `u` for uniform
uniform float uTime;

attribute vec3 position; // vertices coordinates
attribute float aRandom; // custom attribute from script.js -> `a` for attribute

// varying float vRandom;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    // modelPosition.z = aRandom * 0.1;

    // modelPosition.y += uTime;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // gl_Position contains the position of the vertex on the render (screen)
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectedPosition;

    // vRandom = aRandom;
}