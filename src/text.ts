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

  const getTitleMesh = (text: string) => {
    const scale = 0.02;

    const itemGeometry = new MSDFTextGeometry({
      text: text,
      font: font.data,
      align: "right",
      letterSpacing: 4,
    });

    const itemMesh = new THREE.Mesh(itemGeometry, material);
    itemMesh.scale.set(scale, scale, scale);
    itemMesh.rotateX(Math.PI);
    return itemMesh;
  };
  const getItemMesh = (text: string) => {
    const scale = 0.01;

    const itemGeometry = new MSDFTextGeometry({
      text: text,
      font: font.data,
      align: "right",
      letterSpacing: 10,
    });

    const itemMesh = new THREE.Mesh(itemGeometry, material);
    itemMesh.scale.set(scale, scale, scale);
    itemMesh.rotateX(Math.PI);
    return itemMesh;
  };

  const ITEM_MARGIN_BOTTOM = 0.6;
  const TITLE_MARGIN_TOP = 1.5;
  const TITLE_MARGIN_BOTTOM = 1;
  let basePadding = 0;

  Object.keys(menuItems).forEach((key, keyIndex) => {
    if (keyIndex > 0) {
      basePadding += TITLE_MARGIN_TOP;
    }

    const subGroup = new THREE.Group();

    const mesh = getTitleMesh(key);
    mesh.position.y = -basePadding;
    subGroup.add(mesh);

    basePadding += TITLE_MARGIN_BOTTOM;

    const itemsGroup = new THREE.Group();
    menuItems[key].forEach((item, itemIndex) => {
      const itemMesh = getItemMesh(item);
      itemMesh.position.y = -basePadding;
      itemsGroup.add(itemMesh);

      basePadding += ITEM_MARGIN_BOTTOM;
    });

    subGroup.add(itemsGroup);
    group.add(subGroup);
  });

  group.position.z = 90;

  return group;
}
