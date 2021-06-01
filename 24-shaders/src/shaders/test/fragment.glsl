precision mediump float;

// varying float vRandom

void main()
{
    // gl_FragColor contain the fragment color <=> vec4(R,G,B, alpha)
    // gl_FragColor = vec4(vRandom, vRandom*0.5, 1.0, 1.0);
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}