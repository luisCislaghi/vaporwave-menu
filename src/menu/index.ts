import * as THREE from "three";
// @ts-ignore
import { MSDFTextGeometry } from "three-msdf-text-utils";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import ITEMS from "./data";
import { bodyMaterial } from "./materials";

export async function doTextStuff(camera: THREE.PerspectiveCamera) {
  const group = new THREE.Group();

  const font = await new FontLoader().loadAsync(
    // "fonts/roboto-regular.fnt"
    "fonts/DelaGothicOne-Regular-msdf.json"
  );

  // TITLE
  const TITLE_MARGIN_TOP = 1.5;
  const TITLE_MARGIN_BOTTOM = 1;
  const TITLE_SCALE = 0.02;

  // ITEM
  const ITEM_MARGIN_BOTTOM = 0.6;
  const ITEM_SCALE = 0.012;

  const getMesh = (geometry: THREE.BufferGeometry, scale: number) => {
    const mesh = new THREE.Mesh(geometry, bodyMaterial);
    mesh.scale.set(scale, scale, scale);
    mesh.rotateX(Math.PI);
    return mesh;
  };

  const getTitleMesh = (text: string) => {
    const itemGeometry = new MSDFTextGeometry({
      text: text,
      font: font.data,
      align: "right",
      letterSpacing: 4,
    });

    return getMesh(itemGeometry, TITLE_SCALE);
  };

  const getItemMesh = (text: string) => {
    const itemGeometry = new MSDFTextGeometry({
      text: text,
      font: font.data,
      align: "right",
      letterSpacing: 10,
    });

    return getMesh(itemGeometry, ITEM_SCALE);
  };

  const alignToTheRight = (mesh: THREE.Mesh) => {
    // align to the right
    var box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);
    mesh.position.x = -size.x;
  };

  let basePadding = 0;

  Object.keys(ITEMS).forEach((key, keyIndex) => {
    if (keyIndex > 0) {
      basePadding += TITLE_MARGIN_TOP;
    }
    const subGroup = new THREE.Group();

    const mesh = getTitleMesh(key);

    mesh.position.y = -basePadding;
    alignToTheRight(mesh);

    subGroup.add(mesh);

    basePadding += TITLE_MARGIN_BOTTOM;

    const itemsGroup = new THREE.Group();
    ITEMS[key].forEach((item, itemIndex) => {
      const itemMesh = getItemMesh(item);

      itemMesh.position.y = -basePadding;
      alignToTheRight(itemMesh);

      itemsGroup.add(itemMesh);

      basePadding += ITEM_MARGIN_BOTTOM;
    });

    subGroup.add(itemsGroup);
    group.add(subGroup);
  });

  // a little gimmick to get group size
  var box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);

  // get camera view size
  let vect2 = new THREE.Vector2(0, 0);
  camera.getViewSize(5, vect2);

  const lensDistortionCorrection = 0.8;
  const diff = size.x < vect2.x ? size.x / vect2.x : vect2.x / size.x;
  const scale = diff * lensDistortionCorrection;
  group.scale.set(scale, scale, scale);

  // align to the left. add a little offset to the left
  const lensDistortionOffset = 0.4;
  group.position.x = vect2.x / 2 - lensDistortionOffset;

  // align to the top and add a little offset to the top
  group.position.y = vect2.y / 2 - lensDistortionOffset * 2;

  group.position.z = 95;

  return group;
}
