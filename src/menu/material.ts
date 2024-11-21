import * as THREE from "three";
// @ts-ignore
import { uniforms } from "three-msdf-text-utils";
import textVertexShader from "../shaders/textVertex.glsl";
import textFragmentShader from "../shaders/textFragment.glsl";

const atlas = await new THREE.TextureLoader().loadAsync(
  // "fonts/roboto-regular.png"
  "fonts/DelaGothicOne-Regular.png"
);

atlas.premultiplyAlpha = false;
atlas.needsUpdate = true;

const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  defines: {
    IS_SMALL: false,
  },
  extensions: {
    derivatives: true,
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
    uTextureDimentions: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: textVertexShader,
  fragmentShader: textFragmentShader,
});

material.uniforms.uMap.value = atlas;
material.uniforms.uColor.value = new THREE.Color("#ffffff");
material.uniforms.uStrokeColor.value = new THREE.Color("#ff0000");
material.uniforms.uStrokeOutsetWidth.value = 0.9;
material.uniforms.uStrokeInsetWidth.value = 0.4;

console.log();
material.uniforms.uTextureDimentions.value = new THREE.Vector2(
  material.uniforms.uMap.value.image.width,
  material.uniforms.uMap.value.image.height
);

export default material;
