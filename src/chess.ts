import * as THREE from "three";

export function drawChess() {
  // public\images\head_of_helios.png

  const planeSize = 140 * 2;

  const texture = new THREE.TextureLoader().load("images/chess.jpg");
  // const texture = loader.load("./images/checker.png");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  const planeTexture = texture.clone();
  const repeats = planeSize / 30;
  planeTexture.repeat.set(repeats, repeats);
  // and this is example code to get it to be on a plane
  const geometry11 = new THREE.PlaneGeometry(planeSize, planeSize, 16, 16);
  const material11 = new THREE.MeshPhongMaterial({
    map: planeTexture,
    side: THREE.DoubleSide,
  });
  material11.side = THREE.DoubleSide;

  const plane11 = new THREE.Mesh(geometry11, material11);

  plane11.position.z = 80;
  plane11.position.y = -25;

  plane11.rotateX(-((88 * Math.PI) / 180));

  //
  //
  //
  //

  // const geometry = new THREE.SphereGeometry(5, 32, 16, 0, Math.PI / 2, 1, 1.5);
  // const material = new THREE.MeshPhongMaterial({
  //   map: texture,
  //   transparent: true,
  // });
  // const sphere = new THREE.Mesh(geometry, material);

  // sphere.position.z = 2;
  // sphere.position.y = -6;
  // sphere.rotateX((-15 * Math.PI) / 180);
  // sphere.rotateZ((180 * Math.PI) / 180);
  // sphere.rotateY((45 * Math.PI) / 180);

  return plane11;
}
