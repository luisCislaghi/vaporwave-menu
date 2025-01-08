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
import { resizeRendererToDisplaySize } from "./util";

//
// CONSTANTS
//
const FPS = 1000 / 24; // 24 fps for aesthetic reasons

//
// SETUP
//
let canvas = document.querySelector("#c") as Element;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

const camera = getCamera(renderer);

if (resizeRendererToDisplaySize(renderer)) {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

setUpFog(scene);
setUpLight(scene);

//
// OBJECTS
//
drawBackground(scene, camera);
drawChessFloor(scene);
drawHeader(scene, camera);
const statue = drawStatue(scene);
const menu = await drawMenu(scene, camera);

//
// ANIMATION
//

// badTV shaders
const { badTVPass, filmPass, staticPass, composer } = badTvEffect(
  scene,
  camera,
  renderer
);

// scroller setup
let position = 0;
let scrollSpeed = 0;
const scoller = new VirtualScroll();
scoller.on((e) => {
  position = e.deltaY / 100;
  scrollSpeed = e.deltaY / 10;
  menu.position.y += position;
});

// timer variables
let [elapsed, now, then] = [0, 0, Date.now()];
let shaderTime = 0.0;

function animate() {
  // calc elapsed time since last loop
  now = Date.now();
  elapsed = now - then;
  scrollSpeed *= 0.99;

  // if enough time has elapsed, draw the next frame
  if (elapsed > FPS) {
    // get ready for next frame by setting then=now, but also adjust for your
    // specified FPS not being a multiple of RAF's interval (16.7ms or 60fps)
    then = now - (elapsed % FPS);

    // update objects
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

    composer.render(deltaTime);
  }

  requestAnimationFrame(animate);
}

animate();
