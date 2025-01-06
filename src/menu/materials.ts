import * as THREE from "three";
// @ts-ignore
import { uniforms } from "three-msdf-text-utils";
import textVertexShader from "../shaders/textVertex.glsl";
import textFragmentShader from "../shaders/textFragment.glsl";

const atlas = await new THREE.TextureLoader().loadAsync("fonts/Radwave.png");

atlas.premultiplyAlpha = false;
atlas.needsUpdate = true;

const titleMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  defines: {
    IS_SMALL: false,
  },
  uniforms: {
    // Common
    ...uniforms.common,

    // Rendering
    ...uniforms.rendering,
    // uThreshold: { value: 0.05 },
    // uAlphaTest: { value: 0.5 },

    // Strokes
    ...uniforms.strokes,

    // Custom
    uMap: { value: atlas },
    uColor: { value: new THREE.Color("#ffffff") },
    uStrokeColor: { value: new THREE.Color("#ffffff") },
    uStrokeOutsetWidth: { value: 0.2 },
    uStrokeInsetWidth: { value: 0.0 },
  },
  vertexShader: textVertexShader,
  fragmentShader: textFragmentShader,
});

const bodyMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  defines: {
    IS_SMALL: false,
  },
  uniforms: {
    // Common
    ...uniforms.common,

    // Rendering
    ...uniforms.rendering,
    // uThreshold: { value: 0.05 },
    // uAlphaTest: { value: 0.5 },

    // Strokes
    ...uniforms.strokes,

    // Custom
    uMap: { value: atlas },
    uColor: { value: new THREE.Color("#ffffff") },
    uStrokeColor: { value: new THREE.Color("#ffffff") },
    uStrokeOutsetWidth: { value: 0.2 },
    uStrokeInsetWidth: { value: 0.0 },
  },
  vertexShader: textVertexShader,
  fragmentShader: textFragmentShader,
});

export { titleMaterial, bodyMaterial };
