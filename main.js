import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const gLTFLoader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  alpha: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0x5103a3);
scene.add(pointLight, ambientLight);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.08, 25, 25);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    blending: THREE.NormalBlending,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

gLTFLoader.load("SpaceShuttel.gltf", (gltf) => {
  gltf.scene.rotation.x = 1092;
  gltf.scene.rotation.y = 478;

  scene.add(gltf.scene);
});

Array(1500).fill().forEach(addStar);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;
}
document.body.onscroll = moveCamera;

moveCamera();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
