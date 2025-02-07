import * as THREE from "three";
import { setUpLight } from "./light";
import { getCamera } from "./camera";
import { drawBackground } from "./plane";
import { drawStatue } from "./statue";
import { drawChessFloor } from "./chess";
import { drawMenu } from "./menu";
import { badTvEffect } from "./badTv";
import VirtualScroll from "virtual-scroll";
import { drawHeader, MeshType } from "./header";
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
let scrollDiffFromStart = 0;
const startPosition = menu.position.y;
const initScale = header.scale.x;
const initPosition = header.position.x;
const scoller = new VirtualScroll();
scoller.on((e) => {
  scrollDeltaY =
    "wheelDelta" in e.originalEvent ? e.deltaY / 150 : e.deltaY / 240;
  let newPosition = menu.position.y + scrollDeltaY * -1;
  if (
    newPosition >= startPosition &&
    newPosition <= startPosition + menuSize.y
  ) {
    menu.position.y = newPosition;
    scrollDiffFromStart = menu.position.y - startPosition;
    let normalizedDiff =
      scrollDiffFromStart > 1
        ? 1
        : scrollDiffFromStart < 0.1
        ? 0
        : scrollDiffFromStart;
    let scale = initScale - normalizedDiff * initScale * 0.05;
    console.log(initPosition);
    header.scale.set(scale, scale, scale);
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

  // if enough time has elapsed, draw the next frame
  if (elapsed > FPS) {
    // get ready for next frame by setting then=now, but also adjust for your
    // specified FPS not being a multiple of RAF's interval (16.7ms or 60fps)
    then = now - (elapsed % FPS);

    // update objects
    const deltaTime = 0.15;
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
