import * as THREE from "three";
import { ambientLight, light1, light2 } from "./light";
import { getCamera } from "./camera";
import styles from "./styles.css";
import Stats from "three/addons/libs/stats.module.js";
import { drawPlane } from "./plane";
import { drawStatue } from "./statue";
import { drawChess } from "./chess";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
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

// CAMERA
const camera = getCamera(renderer);

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

function animate() {
  stats.update();
  renderer.render(scene, camera);
}
