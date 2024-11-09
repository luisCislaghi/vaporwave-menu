import * as THREE from "three";
// @ts-ignore
import {
  MSDFTextGeometry,
  // MSDFTextMaterial,
  uniforms,
} from "three-msdf-text-utils";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import textVertexShader from "./shaders/textVertex.glsl";
import textFragmentShader from "./shaders/textFragment.glsl";

const menuItems: { [key: string]: string[] } = {
  Hot: [
    "Espresso",
    "V60",
    "Aeropress",
    "Capuccino",
    "Flat White",
    "Caramel Latte",
  ],
  Cold: [
    "Iced Americano",
    "Iced Caramel Latte",
    "Espresso Tonic",
    "Espresso Tonic Orange",
    "Affogato",
  ],
  "Non-Coffee": ["Matcha Latte"],
};

export async function doTextStuff() {
  const group = new THREE.Group();

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

  const keys = Object.keys(menuItems);
  let lastSubGroupPosition = 0;
  keys.forEach((key, keyIndex) => {
    const subGroup = new THREE.Group();
    const titleScale = 0.02;
    const itemScale = 0.01;

    const title = new MSDFTextGeometry({
      text: key,
      font: font.data,
      align: "right",
      letterSpacing: 10,
    });

    const mesh = new THREE.Mesh(title, material);
    mesh.position.y = -keyIndex * 2 + lastSubGroupPosition;
    mesh.scale.set(titleScale, titleScale, titleScale);
    mesh.rotateX(Math.PI);

    subGroup.add(mesh);

    const itemsGroup = new THREE.Group();
    menuItems[key].forEach((item, itemIndex) => {
      const itemGeometry = new MSDFTextGeometry({
        text: item,
        font: font.data,
        align: "right",
        letterSpacing: 4,
      });

      const itemMesh = new THREE.Mesh(itemGeometry, material);
      itemMesh.position.y = -itemIndex * 0.8 - 1 + lastSubGroupPosition;
      itemMesh.scale.set(itemScale, itemScale, itemScale);
      itemMesh.rotateX(Math.PI);

      itemsGroup.add(itemMesh);
    });

    subGroup.add(itemsGroup);
    // REVER ESSE MULTIPLICADOR PARA AJUSTAR A POSIÇÃO DOS ITENS
    // É SÓ IR SOMANDO COMO BASE DAS POSIÇÕES
    lastSubGroupPosition -= menuItems[key].length * 0.8;

    group.add(subGroup);
    group.position.z = 90;
  });

  return group;
}
