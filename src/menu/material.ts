import * as THREE from "three";
// @ts-ignore
import { uniforms } from "three-msdf-text-utils";
import textVertexShader from "../shaders/textVertex.glsl";
import textFragmentShader from "../shaders/textFragment.glsl";

const atlas = await new THREE.TextureLoader().loadAsync(
  "fonts/DelaGothicOne-Regular.png"
);

const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  defines: {
    IS_SMALL: false,
  },
  extensions: {
    // derivatives: true,
  },
  uniforms: {
    // Common
    ...uniforms.common,

    // Rendering
    ...uniforms.rendering,

    // Strokes
    ...uniforms.strokes,
  },
  vertexShader: textVertexShader,
  fragmentShader: textFragmentShader,
});
material.uniforms.uMap.value = atlas;

export default material;
