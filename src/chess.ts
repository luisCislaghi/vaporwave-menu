import * as THREE from "three";

export function drawChessFloor(scene: THREE.Scene) {
  const PLANE_SIZE = 140 * 2;

  const texture = new THREE.TextureLoader().load("images/chess.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  const repeatCount = PLANE_SIZE / 7;
  texture.repeat.set(repeatCount, repeatCount);

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  material.side = THREE.DoubleSide;

  const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 16, 16);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 80;
  mesh.position.y = -25;
  mesh.rotateX(-((88 * Math.PI) / 180));

  scene.add(mesh);

  return mesh;
}
