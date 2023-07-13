import { pageHTML } from "./html";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const overlayBtn = document.getElementById("startButton");
const overlay = document.getElementById("overlay");


overlayBtn.addEventListener("click", main);

function main() {
  // Remove overlays
  overlay.remove();
  // Load HTML from the js file
  pageHTML();
  // Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 0, 10);
  controls.update();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const audioFile = document.getElementById('audioInput');
  const audio = document.getElementById('audio');
  audioFile.addEventListener("change", () => {

    const files = audioFile.files; 
    console.log(files)
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
  });
  



  window.addEventListener("resize", onWindowResize);

  animate();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  // Resize camera according to devices
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
