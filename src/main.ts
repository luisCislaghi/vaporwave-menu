import * as THREE from "three";
import { ambientLight, light1, light2 } from "./light";
import { getCamera } from "./camera";
import styles from "./styles.css";
import Stats from "three/addons/libs/stats.module.js";
import { drawPlane } from "./plane";
import { drawStatue } from "./statue";
import { drawChess } from "./chess";
import { doTextStuff } from "./text";
import { badTvEffect } from "./badTv";

const canvas = document.querySelector("#c") || undefined;
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
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

let shaderTime = 0.0;

const { badTVPass, filmPass, staticPass } = badTvEffect(
  scene,
  camera,
  shaderTime
);

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
const bgPlaneMesh = drawPlane(camera);
scene.add(bgPlaneMesh);

// statue image
const statue = drawStatue();
scene.add(statue);

// chess image
const chess = drawChess();
// scene.add(chess);

// text stuff
// doTextStuff(scene, renderer, camera);
let frame = 0;
function animate() {
  shaderTime += 0.1;
  badTVPass.uniforms["time"].value = shaderTime;
  filmPass.uniforms["time"].value = shaderTime;
  staticPass.uniforms["time"].value = shaderTime;

  frame++;
  if (frame % 50 === 0) {
    frame = 0;
    const random = Math.random() * 2;
    statue.material.uniforms.glitchIntensity.value = 1 + random;
  }
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
