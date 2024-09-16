import * as THREE from "three";
import { ambientLight, light1, light2 } from "./light";
import { getCamera } from "./camera";
import styles from "./styles.css";
import Stats from "three/addons/libs/stats.module.js";
import { drawPlane } from "./plane";
import { drawStatue } from "./statue";
import { drawChess } from "./chess";

const canvas = document.querySelector("#c") || undefined;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
// CAMERA
const camera = getCamera(renderer);

if (resizeRendererToDisplaySize(renderer)) {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

renderer.setAnimationLoop(animate);
// renderer.shadowMap.enabled = true;
// renderer.toneMapping = THREE.ACESFilmicToneMapping; // teste
// renderer.toneMappingExposure = 1.25; // teste
document.body.appendChild(renderer.domElement);
const stats = new Stats();
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

// LIGHTS
scene.add(light1);
scene.add(light2);
scene.add(ambientLight);

// TEXTURE
const loader = new THREE.TextureLoader();
// const spaceTexture = loader.load("./images/space.jpeg");
// scene.background = spaceTexture;

// OBJECTS
// plane with gradient color background
const bgPlaneMesh = drawPlane();
scene.add(bgPlaneMesh);

// statue image
const statue = drawStatue();
scene.add(statue);

// chess image
const chess = drawChess();
scene.add(chess);

// text stuff

function animate() {
  stats.update();
  renderer.render(scene, camera);
}

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
