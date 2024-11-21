import * as THREE from "three";
import glitchVert from "./shaders/glitchVert.glsl";
import glitchFrag from "./shaders/glitchFrag.glsl";

export function drawStatue() {
  const texture = new THREE.TextureLoader().load("images/head_of_helios.png");
  texture.anisotropy = 0;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  //   uniforms
  const shaderUniforms = {
    tDiffuse: { value: texture },
    glitchIntensity: { value: 0 },
  };

  const material11 = new THREE.ShaderMaterial({
    vertexShader: glitchVert,
    fragmentShader: glitchFrag,
    uniforms: shaderUniforms,
    transparent: true,
  });
  material11.side = THREE.DoubleSide;

  const geometry11 = new THREE.PlaneGeometry(40, 40, 64, 64);

  const plane11 = new THREE.Mesh(geometry11, material11);
  plane11.position.z = 50;
  plane11.position.x = -10;

  return plane11;
}
