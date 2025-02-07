import * as THREE from "three";
import { setUpLight } from "./light";
import { getCamera } from "./camera";
import { drawBackground } from "./plane";
import { drawStatue } from "./statue";
import { drawChessFloor } from "./chess";
import { drawMenu } from "./menu";
import { BAD_TV_DEFAULT_PARAMS, badTvEffect } from "./badTv";
import VirtualScroll from "virtual-scroll";
import { drawHeader, MeshType } from "./header";
import { setUpFog } from "./fog";
import { handleCanvasResize, resizeRendererToDisplaySize } from "./util";

declare global {
  interface Window {
    isMobile: boolean;
  }
}

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

handleCanvasResize(renderer, camera);
window.addEventListener("resize", () => {
  handleCanvasResize(renderer, camera);
});

setUpFog(scene);
setUpLight(scene);

//
// OBJECTS
//
drawBackground(scene, camera);
drawChessFloor(scene);
const statue = drawStatue(scene);
const header = await drawHeader(scene, camera);
const menu = await drawMenu(scene, camera);
let box = new THREE.Box3().setFromObject(menu);
const menuSize = new THREE.Vector3();
box.getSize(menuSize);

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
let scrollDeltaY = 0;
let scrollSpeed = 0;
let scrollDiffFromStart = 0;
const startPosition = menu.position.y;
const initScale = header.scale.x;
const initScaleStatue = statue.scale.x;
const initPosition = header.position.x;
const scoller = new VirtualScroll();
scoller.on((e) => {
  if ("wheelDelta" in e.originalEvent) {
    scrollSpeed = e.deltaY / 20;
    scrollDeltaY = e.deltaY / 150;
  } else {
    scrollSpeed = e.deltaY / 8;
    scrollDeltaY = e.deltaY / 240;
  }

  let newPosition = menu.position.y + scrollDeltaY * -1;
  if (
    newPosition >= startPosition &&
    newPosition <= startPosition + menuSize.y
  ) {
    // roll menu
    menu.position.y = newPosition;

    // scroll effects
    scrollDiffFromStart = menu.position.y - startPosition;
    const normalizedDiff =
      scrollDiffFromStart > 1
        ? 1
        : scrollDiffFromStart < 0.1
        ? 0
        : scrollDiffFromStart;

    const headerScale = initScale - normalizedDiff * initScale * 0.05;
    const statueScale =
      initScaleStatue - normalizedDiff * initScaleStatue * -0.02;
    statue.scale.set(statueScale, statueScale, statueScale);
    header.scale.set(headerScale, headerScale, headerScale);
    header.position.x = initPosition + normalizedDiff * 0.08;
    header.rotation.x = normalizedDiff * -0.05 * Math.PI;
    header.children.forEach((e) => {
      (e as unknown as MeshType).material.uniforms["uOpacity"] = {
        value: 1 - normalizedDiff,
      };
    });
  }
});

// timer variables
let [elapsed, now, then] = [0, 0, Date.now()];
let shaderTime = 0.0;

function animate() {
  // calc elapsed time since last loop
  now = Date.now();
  elapsed = now - then;
  if (scrollSpeed < 0.01 && scrollSpeed > -0.01) scrollSpeed = 0;
  else scrollSpeed *= 0.98;

  // if enough time has elapsed, draw the next frame
  if (elapsed > FPS) {
    // get ready for next frame by setting then=now, but also adjust for your
    // specified FPS not being a multiple of RAF's interval (16.7ms or 60fps)
    then = now - (elapsed % FPS);

    // update objects
    const deltaTime = 0.15;
    shaderTime += deltaTime;

    badTVPass.uniforms["distortion"].value =
      BAD_TV_DEFAULT_PARAMS.distortion + scrollSpeed;
    badTVPass.uniforms["distortion2"].value =
      BAD_TV_DEFAULT_PARAMS.distortion2 + scrollSpeed;
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
