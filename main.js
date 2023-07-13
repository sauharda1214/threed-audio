import { pageHTML } from "./html";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const overlayBtn = document.getElementById("startButton");
const overlay = document.getElementById("overlay");
let audioSource = null;

overlayBtn.addEventListener("click", main);

function main() {
  //remove overlays
  overlay.remove();
  //laod HTML from the js file
  pageHTML();
  //scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  //renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  //orbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 0, 10);
  controls.update();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  var audInput = document.getElementById("audioInput");
  var audioListener = new THREE.AudioListener();
  var audioLoader = new THREE.AudioLoader();
  var positionalAudio = new THREE.PositionalAudio(audioListener);


  audInput.addEventListener("change", playAudio)
  function playAudio() {
    
    var file = audInput.files[0];
    var fileURL = URL.createObjectURL(file);

 
    audioLoader.load(fileURL, function (buffer) {
      positionalAudio.setBuffer(buffer);
      positionalAudio.setRefDistance(2);
      document.getElementById('playBtn').onclick = function() {
        positionalAudio.play();
      } 
      positionalAudio.setLoop(true);

      audioSource = positionalAudio;
      cube.add(positionalAudio)
      camera.add(positionalAudio);

    });
  }
 

  window.addEventListener("resize", onWindowResize);

  animate();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  //resize camera according to devices..
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
