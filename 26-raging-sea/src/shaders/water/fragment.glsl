uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main()
{   
    float strenght = vElevation * uColorMultiplier + uColorOffset;
    vec3 color = mix(uDepthColor, uSurfaceColor, strenght);
    gl_FragColor = vec4(color, 1.0);
}