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
import badTVShader from "./shaders/tv/badTVShader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const canvas = document.querySelector("#c") || undefined;
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
// CAMERA
const camera = getCamera(renderer);
console.log(EffectComposer);

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

// let composer = new EffectComposer(renderer);
// let renderPass = new RenderPass(scene, camera);
// let badTVPass = new ShaderPass(badTVShader);
// composer.addPass(renderPass);
// composer.addPass(badTVPass);
// badTVPass.renderToScreen = true;

const { badTVPass, filmPass, staticPass, composer } = badTvEffect(
  scene,
  camera,
  renderer
);

// LIGHTS
scene.add(light1);
scene.add(light2);
scene.add(ambientLight);

// TEXTURE
// const loader = new THREE.TextureLoader();
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
// const chess = drawChess();
// scene.add(chess);

// text stuff
// doTextStuff(scene, renderer, camera);
let frame = 0;
function animate() {
  const deltaTime = 0.3;
  shaderTime += deltaTime;

  badTVPass.uniforms["time"].value = shaderTime;
  filmPass.uniforms["time"].value = shaderTime;
  staticPass.uniforms["time"].value = shaderTime;
  console.log(staticPass);
  composer.render(deltaTime);

  frame++;
  if (frame % 300 === 0) {
    frame = 0;
    const random = Math.random() * 2;
    statue.material.uniforms.glitchIntensity.value = 1 + random;
  }
  stats.update();
  // renderer.render(scene, camera);
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
