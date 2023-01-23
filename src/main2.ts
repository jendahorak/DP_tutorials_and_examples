import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Renderer
const canvas: HTMLElement = document.querySelector('#c') as HTMLElement;
const renderer = new THREE.WebGL1Renderer({
  canvas,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;

function updateRenderer() {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  updateRenderer();
  camera1.aspect = sizes.width / sizes.height;
  camera1.updateProjectionMatrix();
});

// Scene
const scene = new THREE.Scene();
// Camera

const VERTICAL_FOV = 45;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera1 = new THREE.PerspectiveCamera(VERTICAL_FOV, sizes.width / sizes.height);
camera1.position.set(9, 4, 9);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, 2.25);

scene.add(directionalLight);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshToonMaterial({
    color: new THREE.Color('#5EDCAE'),
  }),
);

sphere.position.set(0, 2, 0);
sphere.castShadow = true;
scene.add(sphere);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 10, 10), //ignore-prettier
  new THREE.MeshToonMaterial({ color: '#444' }),
);

plane.rotation.set(-Math.PI / 2, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

scene.add(camera1);
updateRenderer();

export const controls = new OrbitControls(camera1, renderer.domElement);
controls.enableDamping = true;

const loop = () => {
  renderer.render(scene, camera1);
  requestAnimationFrame(loop);
};

loop;
