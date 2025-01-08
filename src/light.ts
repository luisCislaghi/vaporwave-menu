import * as THREE from "three";

const setUpLight = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0x404040, 50); // soft white light
  scene.add(ambientLight);
};

export { setUpLight };
