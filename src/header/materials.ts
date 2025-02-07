import * as THREE from "three";
// @ts-ignore
import { uniforms } from "three-msdf-text-utils";
import textVertexShader from "../shaders/textVertex.glsl";
import textFragmentShader from "../shaders/textFragment.glsl";

const atlasMPLUS = await new THREE.TextureLoader().loadAsync(
  "fonts/MPLUS-medium.png"
);
const atlasRadwave = await new THREE.TextureLoader().loadAsync(
  "fonts/Radwave.png"
);

atlasMPLUS.premultiplyAlpha = false;
atlasMPLUS.needsUpdate = true;
atlasRadwave.premultiplyAlpha = false;
atlasRadwave.needsUpdate = true;

const defaultUnfiforms = {
  // Common
  ...uniforms.common,
  // Rendering
  ...uniforms.rendering,
  // Strokes
  ...uniforms.strokes,
  // Custom
  uMap: { value: atlasRadwave },
  uColor: { value: new THREE.Color("#ef4bae") },
  uStrokeColor: { value: new THREE.Color("#fff") },
  uStrokeOutsetWidth: { value: 0.2 },
  uStrokeInsetWidth: { value: 0.2 },
  // uOpacity: { value: 0.1 },
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
const radwaveMaterial = new THREE.ShaderMaterial(materialConfig);
const mplusMaterial = new THREE.ShaderMaterial({
  ...materialConfig,
  uniforms: {
    ...materialConfig.uniforms,
    uMap: {
      value: atlasMPLUS,
    },
  },
});

export { radwaveMaterial, mplusMaterial };
