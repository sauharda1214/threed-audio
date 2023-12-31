import "./style.css";
import { pageHTML } from "./html";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats.js";
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // for React, Vue and Svelte

const overlayBtn = document.getElementById("startButton");

overlayBtn.addEventListener("click", main);

function main() {
  // remove overlays
  overlay.remove();
  // load HTML from the js file
  pageHTML();
  const stats = new Stats();
  stats.showPanel(0);
  stats.dom.style.position = "relative";
  document.getElementById("stats").appendChild(stats.dom);

  // Custom JavaScript code
  var notyf = new Notyf();

  // scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // orbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.update();

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  ambientLight.position.set(0, 0, 15);
  scene.add(ambientLight);

  const cubegm = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const cubeml = new THREE.MeshBasicMaterial({
    color: 0xffff00,
  });
  const smcube = new THREE.Mesh(cubegm, cubeml);
  scene.add(smcube);

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  var audInput = document.getElementById("audioInput");
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var audioListener = new THREE.AudioListener();
  var positionalAudio = new THREE.PositionalAudio(audioListener);
  var currentAudio = null; // Track the currently playing audio

  // Function to handle audio play
  function playAudio(buffer) {
    if (currentAudio) {
      currentAudio.stop(); // Stop the currently playing audio
    }

    positionalAudio.setBuffer(buffer);
    positionalAudio.setLoop(true);
    positionalAudio.setRefDistance(5.5);
    smcube.add(positionalAudio);
    camera.add(positionalAudio);
    currentAudio = positionalAudio; // Update the currently playing audio
    positionalAudio.play();
  }

  // Calculate average frequency continuously
  var analyser = new THREE.AudioAnalyser(positionalAudio, 512);

  let targetScale = 2; // Target scale for lerping
  const scaleSpeed = 0.1; // Speed for lerping scale
  const color = new THREE.Color(); // Color object for lerping
  const targetColor = new THREE.Color(); // Target color for lerping
  const colorSpeed = 0.07; // Speed for lerping color

  // Function to handle file input change
  audInput.onchange = function fileAud() {
    const file = audInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const arrayBuffer = event.target.result;

      audioContext.decodeAudioData(arrayBuffer, function (buffer) {
        document.getElementById("playBtn").onclick = function () {
          playAudio(buffer);
        };
      });
    };

    reader.readAsArrayBuffer(file);
  };

  // Attach event listeners to buttons with data-src attributes
  var buttons = document.querySelectorAll("div[data-src]");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const dataSrc = this.getAttribute("data-src");

      // Display the loading progress as a toast using Notyf.js
      notyf.open({
        type: "success",
        message: "Loading... Please Wait",
        duration: 0,
      });

      fetch(dataSrc)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
          audioContext.decodeAudioData(arrayBuffer, function (buffer) {
            notyf.dismissAll();
            // Play the audio
            playAudio(buffer);
          });
        })
        .catch((error) => {
          notyf.error("Failed to load the audio.");
        });
    });
  });

  function updateBox() {
    const data = analyser.getAverageFrequency(); // Retrieve average frequency data

    // Calculate target scale based on the average frequency
    targetScale = 1 + data / 50;
    cube.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      scaleSpeed
    );
    smcube.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      scaleSpeed
    );

    // Calculate target color based on the average frequency
    const hue = Math.asin(data / 100);
    targetColor.setHSL(hue, 1, 0.5);

    // Lerp color towards target color
    color.lerp(targetColor, colorSpeed);
    cube.material.color.copy(color);
    smcube.material.color.copy(color);
  }

  //random spheres

  function randomSpheres() {
    const stars = new THREE.BoxGeometry(0.02, 0.02, 0.02);
    const color = new THREE.Color(Math.random() * 0xffffff);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
    });
    const star = new THREE.Mesh(stars, material);
    const group = new THREE.Group();

    const center = new THREE.Vector3(0, 0, 0);
    const outerRadius = 6;
    const innerRadius = 6;
    const angle1 = Math.random() * 2 * Math.PI;
    const angle2 = Math.random() * 2 * Math.PI;
    const radiusOffset =
      Math.sqrt(Math.random()) * (outerRadius - innerRadius) + innerRadius;

    star.position.set(
      center.x + radiusOffset * Math.sin(angle1) * Math.cos(angle2),
      center.y + radiusOffset * Math.sin(angle1) * Math.sin(angle2),
      center.z + radiusOffset * Math.cos(angle1)
    );
    group.add(star);
    scene.add(group);

    const shouldAnimateDepth = Math.random() >= 0.5; // Determine if the sphere should animate its depth
    let originalScale = group.scale.clone(); // Store the original scale for reference

    function updateSphere() {
      const data = analyser.getAverageFrequency(); // Retrieve average frequency data

      // Map the frequency data to a hue value (0 to 1)
      const hue = Math.asin(data / 100); // Assuming getAverageFrequency() returns values from 0 to 255

      // Set the material color based on the hue value
      const color = new THREE.Color().setHSL(hue, 0.5, 0.5); // Using full saturation (1) and medium lightness (0.5)

      // Update the material color
      group.children.forEach((star) => {
        star.material.color.copy(color);
      });

      const depthScale = Math.tan(1 + data / -200); // Adjust the divisor to control the depth increase speed
      const scale = shouldAnimateDepth ? depthScale : 1; // Set the scale based on whether depth animation should occur

      group.scale.lerp(originalScale.clone().multiplyScalar(scale), scaleSpeed); // Apply the scaled depth to the group
    }

    function animateGroup() {
      requestAnimationFrame(animateGroup);
      updateSphere();
    }
    animateGroup();
  }
  Array(2000).fill().forEach(randomSpheres);

  const checkbox = document.getElementById("enable");

  function moveCamera() {
    if (checkbox.checked) {
      return;
    }

    requestAnimationFrame(moveCamera);
    const radius = 30; // Radius of the curves
    const speed = 0.0002; // Speed of camera movement

    const time = speed * Date.now(); // Time-based parameter for the curves

    // X-coordinate of the camera position using a combination of sine and cosine functions
    const x =
      Math.sin(time * Math.PI) *
      Math.cos(time * 2) *
      Math.sin(time * 3) *
      Math.cos(Math.PI * time) *
      radius;

    // Y-coordinate of the camera position using a combination of sine and cosine functions
    const y =
      Math.cos(time * 0.04) *
      Math.sin(time * 1.5, time) *
      Math.sin(time * 2.5, time) *
      radius;

    // Z-coordinate of the camera position using a combination of sine and cosine functions
    const z =
      Math.sin(time * 3) * Math.sin(time * 0.5) * Math.cos(time * 0.5) * radius;

    const threshold = 2; // Minimum distance from the center of the scene

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
    const rotationZ = Math.tanh(time * rotationSpeed * 0.001); // Rotation around the z-axis
    camera.rotation.set(rotationX, rotationY, rotationZ);

    // Animation 2: Varying field of view
    const fov = 60 + Math.sin(time * 0.5) * 20; // Varying field of view
    camera.fov = fov;
    camera.updateProjectionMatrix();

    // Animation 6: Moving the camera's target
    const targetX = Math.acos(time * 1.5) * 5; // X-coordinate of the point the camera looks at
    const targetY = Math.sin(time * 2) * 5; // Y-coordinate of the point the camera looks at
    const targetZ = Math.tan(time * 0.5) * 5; // Z-coordinate of the point the camera looks at
    const lookAtPosition = new THREE.Vector3(targetX, targetY, targetZ);
    camera.lookAt(lookAtPosition);
  }
  moveCamera();
  
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      cancelAnimationFrame(moveCamera);
    } else {
      moveCamera();
    }
  });




  window.addEventListener("resize", onWindowResize);

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.005;
    stats.begin();

    // monitored code goes here

    stats.end();
    controls.update();
    updateBox();
    renderer.render(scene, camera);
  }

  animate();

  //resize camera according to devices..
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
