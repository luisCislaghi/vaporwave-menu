// Varyings
varying vec2 vUv;

// Uniforms: Common
uniform float uOpacity;
uniform float uThreshold;
uniform float uAlphaTest;
uniform vec3 uColor;
uniform sampler2D uMap;

// Uniforms: Strokes
uniform vec3 uStrokeColor;
uniform float uStrokeOutsetWidth;
uniform float uStrokeInsetWidth;

// uniform float pxRange; // set to distance field's pixel range
uniform float uTextureDimentions;

float pxRange = 2.;

// Utils: Median
float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

float screenPxRange(vec3 texture) {
    vec2 unitRange = vec2(pxRange)/vec2(uTextureDimentions);
    vec2 screenTexSize = vec2(1.0)/fwidth(vUv);
    return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

void main() {
    // Common
    // Texture sample
    vec3 s = texture2D(uMap, vUv).rgb;

    

    // Signed distance
    float sigDist = median(s.r, s.g, s.b) - 0.5;

    float afwidth = 1.4142135623730951 / 2.0; //1.414... == sqrt(2)

    #ifdef IS_SMALL
        float alpha = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDist);
    #else
        float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
    #endif

    // Strokes
    // Outset
    float sigDistOutset = sigDist + uStrokeOutsetWidth * 0.5;

    // Inset
    float sigDistInset = sigDist - uStrokeInsetWidth * 0.5;

    #ifdef IS_SMALL
        float outset = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistOutset);
        float inset = 1.0 - smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistInset);
    #else
        float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
        float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
    #endif

//teste
    float screenPxDistance = screenPxRange(s)*(sigDist - 0.5);
    float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);

    // Border
    float border = outset * inset;

    // Alpha Test
    // if (alpha < uAlphaTest) discard;

    // Output: Common
    vec4 filledFragColor = vec4(uColor, uOpacity * alpha);

    gl_FragColor = filledFragColor;

     // Output: Strokes
     vec4 strokedFragColor = vec4(uStrokeColor, uOpacity * border);

     gl_FragColor = mix(filledFragColor, strokedFragColor, border);

    // vec4 color = (filledFragColor) + (uStrokeColor * (outer_opacity - inner_opacity));

}