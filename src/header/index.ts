import * as THREE from "three";
// @ts-ignore
import { MSDFTextGeometry } from "three-msdf-text-utils";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { radwaveMaterial, mplusMaterial } from "./materials";
import { CAMERA_DISTANCE } from "../camera";

export type MeshType = THREE.Mesh<
  THREE.BufferGeometry<THREE.NormalBufferAttributes>,
  THREE.ShaderMaterial,
  THREE.Object3DEventMap
>;

export async function drawHeader(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) {
  const group = new THREE.Group();
  const groupZ = 94;
  const fontMplus = await new FontLoader().loadAsync(
    "fonts/MPLUS-medium-msdf.json"
  );
  const fontRadwave = await new FontLoader().loadAsync(
    "fonts/Radwave-msdf.json"
  );

  // TITLE
  const JP_SCALE = window.isMobile ? 0.017 : 0.04;
  const LATIM_SCALE = window.isMobile ? 0.012 : 0.03;

  const getTextMesh = (
    geometry: THREE.BufferGeometry,
    scale: number,
    material: THREE.ShaderMaterial
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(scale, scale, scale);
    mesh.rotateX(Math.PI);
    return mesh;
  };

  const getJPTextMesh = (text: string) => {
    const geometry = new MSDFTextGeometry({
      text: text,
      font: fontMplus.data,
      align: "right",
      letterSpacing: 22,
    });

    return getTextMesh(geometry, JP_SCALE, mplusMaterial);
  };

  const getLatinTextMesh = (text: string) => {
    const geometry = new MSDFTextGeometry({
      text: text,
      font: fontRadwave.data,
      align: "right",
      letterSpacing: 20,
    });

    return getTextMesh(geometry, LATIM_SCALE, radwaveMaterial);
  };

  const jpMesh = getJPTextMesh("コーヒー");
  group.add(jpMesh);

  const latinMesh = getLatinTextMesh("COFFEE");
  latinMesh.position.x += 0.1;
  latinMesh.position.y -= window.isMobile ? 0.6 : 1.6;
  group.add(latinMesh);

  // a little gimmick to get group size
  let box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);

  // get camera view size
  let vect2 = new THREE.Vector2(0, 0);
  camera.getViewSize(CAMERA_DISTANCE - groupZ, vect2);

  const lensDistortionCorrection = 0.8;
  const diff = size.x < vect2.x ? size.x / vect2.x : vect2.x / size.x;
  const scale = diff * lensDistortionCorrection;
  group.scale.set(scale, scale, scale);

  // align to the left and add a little offset to the left
  const lensDistortionOffset = window.isMobile ? 0.6 : 2;
  group.position.x -= size.x - lensDistortionOffset;
  // group.position.x -= vect2.x / 2 - lensDistortionOffset;

  // align to the top and add a little offset to the top
  const lensDistortionOffsetTop = window.isMobile
    ? lensDistortionOffset * 2
    : lensDistortionOffset - 0.5;
  group.position.y = vect2.y / 2 - lensDistortionOffsetTop;

  group.position.z = groupZ;

  scene.add(group);
  return group;
}
