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

var pointLight2 = new THREE.PointLight("0xffffff");
pointLight2.position.set(-1.7, 0, 0);
pointLight2.add(
  new THREE.Mesh(
    new THREE.SphereGeometry(1, 10, 10),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
    })
  )
);

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

let gltfReference = undefined;

gLTFLoader.load("SpaceShuttel.gltf", (gltf) => {
  gltf.scene.rotation.x = 1092;
  gltf.scene.rotation.y = 478;

  gltfReference = gltf.scene;
  scene.add(gltfReference);
});

Array(1500).fill().forEach(addStar);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;
}

let takeoff = false;

function takeOff() {
  scene.add(pointLight2);
  takeoff = true;
}

document.body.onscroll = moveCamera;
document.querySelector("#btnTakeOff").onclick = takeOff;

moveCamera();

function animate() {
  requestAnimationFrame(animate);

  if (takeoff) {
    gltfReference.position.z -= 10;
    pointLight2.position.z += 1;
    pointLight2.position.x -= 0.04;
    pointLight2.scale.x += 2.5;
    pointLight2.scale.y += 0.2;
    pointLight2.scale.z += 0.2;

    if (pointLight2.position.z > camera.position.z) {
      takeoff = false;
    }
  }

  renderer.render(scene, camera);
}

animate();
