import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function getCamera(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);
  camera.position.y = 0;
  camera.position.z = 100;
  // camera.position.z = 20; // test to debug text

  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.target.set(0, 0, 0);
  // controls.update();
  // controls.enablePan = false;
  // controls.enableDamping = true;

  return camera;
}

export { getCamera };
