import * as THREE from "three";
import badTVShader from "./shaders/tv/badTVShader.js";
import staticShader from "./shaders/tv/staticShader.js";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { MaskPass } from "three/addons/postprocessing/MaskPass.js";
import { CopyShader } from "three/addons/shaders/CopyShader.js";
import { FilmShader } from "three/addons/shaders/FilmShader.js";
import { RGBShiftShader } from "three/addons/shaders/RGBShiftShader.js";

//  https://github.com/felixturner/bad-tv-shader/blob/master/example/index.html

export function badTvEffect(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  // console.log(badTVShader);
  // console.log(staticShader);

  let composer;

  //Create Shader Passes
  const renderPass = new RenderPass(scene, camera);
  const badTVPass = new ShaderPass(badTVShader);
  const rgbPass = new ShaderPass(RGBShiftShader);
  const filmPass = new ShaderPass(FilmShader);
  const staticPass = new ShaderPass(staticShader);
  const copyPass = new ShaderPass(CopyShader);

  //set shader uniforms
  filmPass.uniforms.grayscale.value = 0;

  //Init DAT GUI control panel
  let badTVParams = {
    show: true,
    distortion: 0.8,
    distortion2: 1.5,
    speed: 0.07,
    rollSpeed: 0.0,
  };

  let staticParams = {
    show: true,
    amount: 0.05,
    size: 2.0,
  };

  let rgbParams = {
    show: false,
    amount: 0.005,
    angle: 0.0,
  };

  let filmParams = {
    show: false,
    count: 800,
    sIntensity: 0.1,
    nIntensity: 0.1,
  };

  function onToggleShaders() {
    //Add Shader Passes to Composer
    //order is important
    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);

    if (filmParams.show) {
      composer.addPass(filmPass);
    }

    if (badTVParams.show) {
      composer.addPass(badTVPass);
    }

    if (rgbParams.show) {
      composer.addPass(rgbPass);
    }

    if (staticParams.show) {
      composer.addPass(staticPass);
    }

    composer.addPass(copyPass);
    copyPass.renderToScreen = true;
  }

  function onParamsChange() {
    //copy gui params into shader uniforms
    badTVPass.uniforms["distortion"] = { value: badTVParams.distortion };
    badTVPass.uniforms["distortion2"] = { value: badTVParams.distortion2 };
    badTVPass.uniforms["speed"] = { value: badTVParams.speed };
    badTVPass.uniforms["rollSpeed"] = { value: badTVParams.rollSpeed };

    staticPass.uniforms["amount"] = { value: staticParams.amount };
    staticPass.uniforms["size"] = { value: staticParams.size };

    rgbPass.uniforms["angle"] = { value: rgbParams.angle * Math.PI };
    rgbPass.uniforms["amount"] = { value: rgbParams.amount };

    filmPass.uniforms["sCount"] = { value: filmParams.count };
    filmPass.uniforms["sIntensity"] = { value: filmParams.sIntensity };
    filmPass.uniforms["nIntensity"] = { value: filmParams.nIntensity };
  }

  onToggleShaders();
  onParamsChange();
  // console.log(composer);

  return { badTVPass, filmPass, staticPass, composer };
}
