varying vec2 vUv; 

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
    // Pattern 1 - classic!
    // gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // Pattern 2 - no blue
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // Pattern 2.5 - just another nice color!
    // gl_FragColor = vec4(vUv, 0.5, 1.0);

    // Pattern 3 - black and white
    // float strength = vUv.x;

    // Pattern 4 - black and white
    // float strength = vUv.y;

    // Pattern 5 - pattern 4 opposite
    // float strength = 1.0 - vUv.y;

    // Pattern 6
    // float strength = vUv.y * 10.0;

    // Pattern 7 - modulo
    // float strength = mod(vUv.y * 10.0, 1.0); // limit is 1.0

    // Pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0); // limit is 1.0
    /*
    // /!\ Do not use conditions, they are bad for performances.
    // /!\ Better to use step
    // if (strength < 0.5) {
    //     strength = 0.0;
    // } else {
    //     strength = 1.0;
    // }
    // or strength = strength < 0.5 ? 0.0 : 1.0
    */
    // strength = step(0.5, strength); // same as the if/self but with step

    // Pattern 9
    // float strength = mod(vUv.y * 10.0, 1.0); // limit is 1.0
    // strength = step(0.8, strength); // same as the if/self but with step

    // Pattern 10
    // float strength = mod(vUv.x * 10.0, 1.0); // limit is 1.0
    // strength = step(0.8, strength); // same as the if/self but with step
    
    // Pattern 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)); 
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // Pattern 12
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)); 
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // Pattern 13
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0)); 
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // Pattern 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)); 
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)); 
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0)); 

    // float strength = barX + barY;

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 15
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)); 
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)); 
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0)); 

    // float strength = barX + barY;

    // Pattern 16
    // float strength = abs(vUv.x - 0.5);

    // Pattern 17
    // float barX = abs(vUv.x - 0.5);
    // float barY = abs(vUv.y - 0.5);
    // float strength = min(barX, barY);
    
    // Pattern 18
    // float barX = abs(vUv.x - 0.5);
    // float barY = abs(vUv.y - 0.5);
    // float strength = max(barX, barY);

    // Pattern 19
    // float barX = abs(vUv.x - 0.5);
    // float barY = abs(vUv.y - 0.5);
    // float strength = step(0.2, max(barX, barY));

    // Pattern 20
    // float barX = abs(vUv.x - 0.5);
    // float barY = abs(vUv.y - 0.5);
    // float square1 = step(0.2, max(barX, barY));
    // float square2 = 1.0 - step(0.25, max(barX, barY));
    // float strength = square1 * square2;

    // Pattern 21
    // float strength = round(vUv.x * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 22
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // strength *= floor(vUv.y * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 23
    // float strength = random(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 24
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0,
    //     floor(vUv.y * 10.0) / 10.0
    // );

    // float strength = random(gridUv);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 25
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) / 10.0, 
    //     floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0
    // );

    // float strength = random(gridUv);

    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 26
    // float strength = length(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 27
    // solution 1 float strength = length(vUv - 0.5);
    // or slution 2:
    // float strength = distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // Pattern 28
    float strength = 1.0 - distance(vUv, vec2(0.5));
    gl_FragColor = vec4(strength, strength, strength, 1.0);
    
}
