import * as THREE from "three";

export function drawStatue() {
  // public\images\head_of_helios.png

  const texture = new THREE.TextureLoader().load("images/head_of_helios.png");
  // and this is example code to get it to be on a plane
  // const geometry11 = new THREE.PlaneGeometry(5, 5, 16, 16);
  const geometry11 = new THREE.PlaneGeometry(40, 40, 64, 64);
  const material11 = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
  });
  material11.side = THREE.DoubleSide;
  // const material11 = new THREE.MeshBasicMaterial({ map: texture });
  const plane11 = new THREE.Mesh(geometry11, material11);
  plane11.position.z = 50;
  plane11.position.x = -8;
  // plane11.rotateY(1.571);
  return plane11;
}
