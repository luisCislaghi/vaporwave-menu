import * as THREE from "three";
// @ts-ignore
import {
  MSDFTextGeometry,
  MSDFTextMaterial,
  uniforms,
} from "three-msdf-text-utils";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import VirtualScroll from "virtual-scroll";
import textVertexShader from "./shaders/textVertex.glsl.js";
import textFragmentShader from "./shaders/textFragment.glsl.js";

const items = [
  "Americano",
  "Cappuccino",
  "Espresso",
  "Latte",
  "Macchiato",
  "Mocha",
  "Flat White",
];

export async function doTextStuff(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera
) {
  const group = new THREE.Group();

  scene.add(group);
  let position = 0;

  const font = await new FontLoader().loadAsync(
    "fonts/DelaGothicOne-Regular-msdf.json"
  );
  const atlas = await new THREE.TextureLoader().loadAsync(
    "fonts/DelaGothicOne-Regular.png"
  );

  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    defines: {
      IS_SMALL: false,
    },
    extensions: {
      // derivatives: true,
    },
    uniforms: {
      // Common
      ...uniforms.common,

      // Rendering
      ...uniforms.rendering,

      // Strokes
      ...uniforms.strokes,
    },
    vertexShader: textVertexShader,
    fragmentShader: textFragmentShader,
  });
  material.uniforms.uMap.value = atlas;

  const scoller = new VirtualScroll();

  scoller.on((e) => {
    const delta = e.deltaY;
    position += delta * 0.1;
    group.position.y = position;
    console.log(position);
  });

  items.forEach((item, index) => {
    const geometry = new MSDFTextGeometry({
      text: item,
      font: font.data,
      align: "right",
      letterSpacing: 3,
    });
    console.log(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    // mesh.position.z = 10;

    mesh.position.y = 10 - index * 2;
    mesh.position.z = 90;
    mesh.rotateX(Math.PI);
    const scale = 0.02;
    mesh.scale.set(scale, scale, scale);

    group.add(mesh);
  });
}
