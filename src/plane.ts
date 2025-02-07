import * as THREE from "three";
import { CAMERA_DISTANCE } from "./camera";

export function drawBackground(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) {
  const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

  const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  void main() {
    vec3 color = mix(bottomColor, topColor, vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`;

  // Create ShaderMaterial with custom colors
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      topColor: { value: new THREE.Color("hsl(320, 98%, 19%)") },
      bottomColor: { value: new THREE.Color("hsl(291, 97%, 22%)") },
    },
  });
  material.side = THREE.DoubleSide;

  let vect2 = new THREE.Vector2(0, 0);
  camera.getViewSize(CAMERA_DISTANCE, vect2);
  const width = vect2.x;
  const height = vect2.y - vect2.y / 3;

  const geometry = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = vect2.y / 3 / 2;

  scene.add(mesh);
  return mesh;
}
