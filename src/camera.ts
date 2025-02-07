import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const CAMERA_DISTANCE = 100;

function getCamera(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const size = new THREE.Vector2();
  renderer.getSize(size);
  const width = size.width;
  const height = size.height;

  const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);
  camera.position.y = 0;
  camera.position.z = CAMERA_DISTANCE;

  return camera;
}

export { getCamera, CAMERA_DISTANCE };
