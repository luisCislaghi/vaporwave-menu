import * as THREE from "three";
import { ambientLight, light1, light2 } from "./light";
import { getCamera } from "./camera";
import { drawPlane } from "./plane";
import { drawStatue } from "./statue";
import { drawChess } from "./chess";
import { doTextStuff } from "./menu";
import { badTvEffect } from "./badTv";
import Stats from "three/addons/libs/stats.module.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import VirtualScroll from "virtual-scroll";

let canvas = document.querySelector("#c") || undefined;
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
// CAMERA
const camera = getCamera(renderer);

canvas = renderer.domElement;

if (resizeRendererToDisplaySize(renderer)) {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

// renderer.shadowMap.enabled = true;
// renderer.toneMapping = THREE.ACESFilmicToneMapping; // teste
// renderer.toneMappingExposure = 1.25; // teste
document.body.appendChild(renderer.domElement);
// const stats = new Stats();
// document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

let shaderTime = 0.0;
let position = 0;
let scrollSpeed = 0;

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

// OBJECTS
// plane with gradient color background
const bgPlaneMesh = drawPlane(camera);
scene.add(bgPlaneMesh);

// statue image
const statue = drawStatue();
scene.add(statue);

// chess image
const chess = drawChess();
scene.add(chess);

// text stuff
const textGroup = await doTextStuff(camera);
scene.add(textGroup);

const scoller = new VirtualScroll();

scoller.on((e) => {
  position = e.deltaY / 100;
  scrollSpeed = e.deltaY / 10;
  textGroup.position.y += position;
});

// initialize the timer variables
let [fpsInterval, now, then, elapsed]: number[] = [];

function animate() {
  // calc elapsed time since last loop
  now = Date.now();
  elapsed = now - then;
  scrollSpeed *= 0.99;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);

    // Put your drawing code here
    const deltaTime = 0.1;
    shaderTime += deltaTime;

    badTVPass.uniforms["time"].value = shaderTime;
    filmPass.uniforms["time"].value = shaderTime;
    staticPass.uniforms["time"].value = shaderTime;

    if (shaderTime > 2 && shaderTime < 3) {
      shaderTime = 0;
      const random = Math.random() * 2;
      statue.material.uniforms.glitchIntensity.value = 1 + random;
    }
    if (statue.material.uniforms.glitchIntensity.value > 0 && shaderTime > 1) {
      statue.material.uniforms.glitchIntensity.value = 0;
    }
    // stats.update();

    composer.render(deltaTime);
  }

  requestAnimationFrame(animate);
}

function startAnimating(fps: number) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  animate();
}

startAnimating(24);

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
