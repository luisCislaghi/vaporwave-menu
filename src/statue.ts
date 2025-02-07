import * as THREE from "three";
import glitchVert from "./shaders/glitchVert.glsl";
import glitchFrag from "./shaders/glitchFrag.glsl";

export function drawStatue(scene: THREE.Scene) {
  const fog = scene.fog as THREE.Fog;

  const texture = new THREE.TextureLoader().load("images/head_of_helios.png");
  texture.anisotropy = 0;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  //   uniforms
  const shaderUniforms = {
    tDiffuse: { value: texture },
    glitchIntensity: { value: 0 },
    fogColor: { type: "c", value: fog.color },
    fogNear: { type: "f", value: fog.near },
    fogFar: { type: "f", value: fog.far },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: glitchVert,
    fragmentShader: glitchFrag,
    uniforms: shaderUniforms,
    transparent: true,
    fog: fog !== undefined,
  });

  material.side = THREE.DoubleSide;

  const geometry = new THREE.PlaneGeometry(40, 40, 64, 64);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 45;
  mesh.position.x = -9;

  scene.add(mesh);
  return mesh;
}
