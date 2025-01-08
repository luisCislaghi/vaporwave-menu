import * as THREE from "three";
import { setUpLight } from "./light";
import { getCamera } from "./camera";
import { drawBackground } from "./plane";
import { drawStatue } from "./statue";
import { drawChessFloor } from "./chess";
import { drawMenu } from "./menu";
import { badTvEffect } from "./badTv";
import VirtualScroll from "virtual-scroll";
import { drawHeader } from "./header";
import { setUpFog } from "./fog";

let canvas = document.querySelector("#c") || undefined;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

// CAMERA
const camera = getCamera(renderer);

canvas = renderer.domElement;

if (resizeRendererToDisplaySize(renderer)) {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

let shaderTime = 0.0;
let position = 0;
let scrollSpeed = 0;

const { badTVPass, filmPass, staticPass, composer } = badTvEffect(
  scene,
  camera,
  renderer
);

// SETUP
setUpFog(scene);
setUpLight(scene);

// OBJECTS
drawBackground(scene, camera);
drawChessFloor(scene);
drawHeader(scene, camera);
const statue = drawStatue(scene);
const menu = await drawMenu(scene, camera);

// ANIMATION LOOP

const scoller = new VirtualScroll();
scoller.on((e) => {
  position = e.deltaY / 100;
  scrollSpeed = e.deltaY / 10;
  menu.position.y += position;
});
// timer variables
let [fpsInterval, now, then, elapsed]: number[] = [];

function animate() {
  // calc elapsed time since last loop
  now = Date.now();
  elapsed = now - then;
  scrollSpeed *= 0.99;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    // get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);

    // drawing code here
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
