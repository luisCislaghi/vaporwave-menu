import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function getCamera(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);
  camera.position.y = 0;
  camera.position.z = 100;

  return camera;
}

export { getCamera };
