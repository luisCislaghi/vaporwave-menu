import * as THREE from "three";

const setUpFog = (scene: THREE.Scene) => {
  const FOG_COLOR = new THREE.Color("hsl(175, 22%, 45%)");
  const FOG_NEAR = 20;
  const FOG_FAR = 120;

  scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
};

export { setUpFog };
