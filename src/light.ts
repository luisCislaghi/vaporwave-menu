import * as THREE from "three";

const sphere = new THREE.SphereGeometry(0.1, 16, 8);

let light1 = new THREE.PointLight(0xffffff, 1, 300);
light1.add(
  new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 }))
);
let light2 = new THREE.PointLight(0xffffff, 1, 300);
light2.add(
  new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xfaaf00 }))
);
light1.position.set(3, 2, 3);
light2.position.set(3, 2, 5);

const ambientLight = new THREE.AmbientLight(0x404040, 50); // soft white light

export { light1, light2, ambientLight };
