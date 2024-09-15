import * as THREE from "three";

export function drawPlane() {
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
  uniform vec3 color1;
  uniform vec3 color2;
  void main() {
    vec3 color = mix(color1, color2, vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`;

  // Create ShaderMaterial with custom colors
  const bgPlaneMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      color1: { value: new THREE.Color("hsl(326, 100%, 91%)") }, // pink
      color2: { value: new THREE.Color("hsl(196, 100%, 84%)") }, // blue
    },
  });

  // const bgPlaneGeo = new THREE.PlaneGeometry(4.62, 10);
  const bgPlaneGeo = new THREE.PlaneGeometry(46.2, 100);
  const bgPlaneMesh = new THREE.Mesh(bgPlaneGeo, bgPlaneMaterial);
  return bgPlaneMesh;
}
