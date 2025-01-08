import * as THREE from "three";
// @ts-ignore
import { MSDFTextGeometry } from "three-msdf-text-utils";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { jpMaterial } from "./materials";

export async function drawHeader(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) {
  const group = new THREE.Group();
  const groupZ = 95;
  const font = await new FontLoader().loadAsync("fonts/MPLUS-medium-msdf.json");
  // const font = await new FontLoader().loadAsync(
  //   "fonts/DelaGothicOne-JP-msdf.json"
  // );

  // TITLE
  const TITLE_MARGIN_TOP = 1.5;
  const TITLE_MARGIN_BOTTOM = 1;
  const TITLE_SCALE = 0.015;

  const getMesh = (geometry: THREE.BufferGeometry, scale: number) => {
    const mesh = new THREE.Mesh(geometry, jpMaterial);
    mesh.scale.set(scale, scale, scale);
    mesh.rotateX(Math.PI);
    return mesh;
  };

  const getTextMesh = (text: string) => {
    const itemGeometry = new MSDFTextGeometry({
      text: text,
      font: font.data,
      align: "right",
      letterSpacing: 5,
    });

    return getMesh(itemGeometry, TITLE_SCALE);
  };

  const alignToTheLeft = (mesh: THREE.Mesh) => {
    // align to the left
    var box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);
    mesh.position.x -= size.x * 2;
  };

  const titleMesh = getTextMesh("コーヒー");
  alignToTheLeft(titleMesh);
  group.add(titleMesh);
  // a little gimmick to get group size
  var box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);

  // get camera view size
  let vect2 = new THREE.Vector2(0, 0);
  camera.getViewSize(100 - groupZ, vect2);

  const lensDistortionCorrection = 0.8;
  const diff = size.x < vect2.x ? size.x / vect2.x : vect2.x / size.x;
  const scale = diff * lensDistortionCorrection;
  group.scale.set(scale, scale, scale);

  // align to the left. add a little offset to the left
  const lensDistortionOffset = 0.4;
  group.position.x = vect2.x / 2 - lensDistortionOffset;

  // align to the top and add a little offset to the top
  group.position.y = vect2.y / 2 - lensDistortionOffset * 2;

  group.position.z = groupZ;

  scene.add(group);
  return group;
}
