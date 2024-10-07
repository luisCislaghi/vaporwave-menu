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
  shaderTime: number
) {
  let composer;
  let badTVParams;
  let staticParams;
  let rgbParams;
  let filmParams;

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
  badTVParams = {
    mute: true,
    show: true,
    distortion: 3.0,
    distortion2: 1.0,
    speed: 0.3,
    rollSpeed: 0.1,
  };

  staticParams = {
    show: true,
    amount: 0.5,
    size: 4.0,
  };

  rgbParams = {
    show: true,
    amount: 0.005,
    angle: 0.0,
  };

  filmParams = {
    show: true,
    count: 800,
    sIntensity: 0.9,
    nIntensity: 0.4,
  };

  return { badTVPass, filmPass, staticPass };
}
