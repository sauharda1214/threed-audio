import { pageHTML } from "./html";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const overlayBtn = document.getElementById("startButton");
const overlay = document.getElementById("overlay");
let audioSource = null;

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

  function playAudio(file, onProgress) {
    var fileURL = URL.createObjectURL(file);

    var audioListener = new THREE.AudioListener();
    var audioLoader = new THREE.AudioLoader();

    var xhr = new XMLHttpRequest();
    xhr.open("GET", fileURL, true);
    xhr.responseType = "blob";

    xhr.addEventListener("progress", function (event) {
      if (event.lengthComputable) {
        var percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete.toFixed(2));
      }
    });

    xhr.onload = function () {
      if (xhr.status === 200) {
        var blob = xhr.response;
        audioLoader.load(URL.createObjectURL(blob), function (buffer) {
          if (audioSource) {
            audioSource.stop(); // Stop the current audio source if it exists
          }

          var positionalAudio = new THREE.PositionalAudio(audioListener);
          positionalAudio.setBuffer(buffer);
          positionalAudio.setRefDistance(2);
          positionalAudio.setLoop(true);
          positionalAudio.play()
          audioSource = positionalAudio;
          cube.add(positionalAudio);
          camera.add(positionalAudio);
        });
      }
    };

    xhr.send();
  }

  var audInput = document.getElementById("audioInput");
  var progressText = document.getElementById("progressText");
  var playBtn = document.getElementById("playBtn");
  playBtn.hidden = true;

  audInput.addEventListener("change", function () {
    var file = audInput.files[0];
    playAudio(file, function (progress) {
      progressText.innerText = progress + "%";
      if (progress === "100.00") {
        playBtn.hidden = false; // Enable the button after file upload is complete
      }
    });
  });

  playBtn.addEventListener("click", function () {
    if (audioSource) {
      audioSource.play();
    }
  });

  // Animate camera
  animateCam();
  function animateCam() {
    requestAnimationFrame(animateCam);

    const radius = 10; // Radius of the curves
    const speed = 0.0003; // Speed of camera movement

    const time = speed * Date.now(); // Time-based parameter for the curves

    // X-coordinate of the camera position using a combination of sine and cosine functions
    const x =
      Math.sin(time) *
      Math.cos(time * 2) *
      Math.sin(time * 3) *
      Math.cos(Math.PI * time) *
      radius;

    // Y-coordinate of the camera position using a combination of sine and cosine functions
    const y =
      Math.tanh(time * 0.5) *
      Math.sin(time * 1.5, time) *
      Math.cos(time * 2.5) *
      radius;

    // Z-coordinate of the camera position using a combination of sine and cosine functions
    const z =
      Math.sin(time * 3) * Math.cos(time * 0.5) * Math.sin(time * 0.5) * radius;

    const threshold = 3; // Minimum distance from the center of the scene

    // Check if the camera position is within the threshold bounds
    const distance = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    if (distance < threshold) {
      // Normalize the vector and multiply by the threshold value
      const scaleFactor = threshold / distance;
      camera.position.set(x * scaleFactor, y * scaleFactor, z * scaleFactor);
    } else {
      camera.position.set(x, y, z);
    }

    // Additional Animations: Combine multiple effects

    // Animation 1: Changing the camera's rotation
    const rotationSpeed = 0.001; // Speed of camera rotation
    const rotationX = Math.cos(time * rotationSpeed); // Rotation around the x-axis
    const rotationY = Math.sin(time * rotationSpeed, time); // Rotation around the y-axis
    const rotationZ = Math.tan(time * rotationSpeed * 0.001); // Rotation around the z-axis
    camera.rotation.set(rotationX, rotationY, rotationZ);

    // Animation 2: Varying field of view
    const fov = 60 + Math.sin(time * 0.5) * 20; // Varying field of view
    camera.fov = fov;
    camera.updateProjectionMatrix();

    // Animation 3: Changing the camera's up vector
    const upVectorX = Math.cos(time * 0.8); // X-component of the camera's up vector
    const upVectorY = Math.sin(time * 1.2); // Y-component of the camera's up vector
    const upVectorZ = Math.sin(time * 0.4); // Z-component of the camera's up vector
    const upVector = new THREE.Vector3(
      upVectorX,
      upVectorY,
      upVectorZ
    ).normalize();
    camera.up.copy(upVector);

    // Animation 6: Moving the camera's target
    const targetX = Math.cos(time * 1.5) * 5; // X-coordinate of the point the camera looks at
    const targetY = Math.sin(time * 2) * 5; // Y-coordinate of the point the camera looks at
    const targetZ = Math.tan(time * 0.5) * 5; // Z-coordinate of the point the camera looks at
    const lookAtPosition = new THREE.Vector3(targetX, targetY, targetZ);
    camera.lookAt(lookAtPosition);

    controls.update();
    renderer.render(scene, camera);
  }

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
