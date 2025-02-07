import * as THREE from "three";
// @ts-ignore
import { uniforms } from "three-msdf-text-utils";
import textVertexShader from "../shaders/textVertex.glsl";
import textFragmentShader from "../shaders/textFragment.glsl";

const atlas = await new THREE.TextureLoader().loadAsync("fonts/Radwave.png");
atlas.premultiplyAlpha = false;
atlas.needsUpdate = true;

const defaultUnfiforms = {
  // Common
  ...uniforms.common,
  // Rendering
  ...uniforms.rendering,
  // Strokes
  ...uniforms.strokes,
  // Custom
  uMap: { value: atlas },
  uColor: { value: new THREE.Color("#ef4bae") },
  uStrokeColor: { value: new THREE.Color("#f06488") },
  uStrokeOutsetWidth: { value: 0.1 },
  uStrokeInsetWidth: { value: 0.1 },
};

const materialConfig = {
  side: THREE.DoubleSide,
  transparent: true,
  defines: {
    IS_SMALL: false,
  },
  uniforms: defaultUnfiforms,
  vertexShader: textVertexShader,
  fragmentShader: textFragmentShader,
};

// yes, they are the same material. I let it this way because I may want to change it later
const titleMaterial = new THREE.ShaderMaterial(materialConfig);
const bodyMaterial = new THREE.ShaderMaterial(materialConfig);

export { titleMaterial, bodyMaterial };
