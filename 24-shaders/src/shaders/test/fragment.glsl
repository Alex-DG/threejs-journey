precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;
// varying float vRandom

void main()
{
     vec4 textureColor = texture2D(uTexture, vUv);
     textureColor.rgb *= vElevation * 2.0 + 0.5;

    // gl_FragColor contain the fragment color <=> vec4(R,G,B, alpha)
    // gl_FragColor = vec4(vRandom, vRandom*0.5, 1.0, 1.0);
    // gl_FragColor = vec4(uColor, 1.0);
    gl_FragColor = textureColor;
}