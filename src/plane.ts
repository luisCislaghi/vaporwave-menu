import * as THREE from "three";

export function drawPlane(camera: THREE.PerspectiveCamera) {
  const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

  // Fragment Shader
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
  const bgPlaneMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      topColor: { value: new THREE.Color("hsl(175, 23%, 29%)") },
      bottomColor: { value: new THREE.Color("hsl(175, 22%, 45%)") },
    },
  });
  bgPlaneMaterial.side = THREE.DoubleSide;

  let vect2 = new THREE.Vector2(0, 0);
  camera.getViewSize(100, vect2);
  const width = vect2.x;
  const height = vect2.y - vect2.y / 3;

  const bgPlaneGeo = new THREE.PlaneGeometry(width, height);
  const bgPlaneMesh = new THREE.Mesh(bgPlaneGeo, bgPlaneMaterial);
  bgPlaneMesh.position.y = vect2.y / 3 / 2;
  return bgPlaneMesh;
}
