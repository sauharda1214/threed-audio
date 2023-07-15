import { pageHTML } from "./html";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats.js";

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
    wireframeLinewidth: 2,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  var audInput = document.getElementById("audioInput");
  var audioListener = new THREE.AudioListener();
  var audioLoader = new THREE.AudioLoader();
  var positionalAudio = new THREE.PositionalAudio(audioListener);
  var currentAudio = null; // Track the currently playing audio

  // Function to handle audio play
  function playAudio(buffer) {
    if (currentAudio) {
      currentAudio.stop(); // Stop the currently playing audio
    }

    positionalAudio.setBuffer(buffer);
    positionalAudio.setLoop(true);
    positionalAudio.setRefDistance(3.5);
    smcube.add(positionalAudio);
    camera.add(positionalAudio);
    positionalAudio.play();

    currentAudio = positionalAudio; // Update the currently playing audio
  }

  // Calculate average frequency continuously
  var analyser = new THREE.AudioAnalyser(positionalAudio, 512);

  // Function to handle file input change
  audInput.onchange = function () {
    const file = audInput.files[0];
    audioLoader.load(URL.createObjectURL(file), function (buffer) {
      document.getElementById("playBtn").onclick = function () {
        playAudio(buffer);
      };
    });
  };

  function handleButtonClick() {
    const dataSrc = this.getAttribute("data-src");
    const urlObject = new URL(dataSrc, window.location.href);

    console.log(urlObject.href)
    audioLoader.load(urlObject.href, function (buffer) {
      playAudio(buffer);
    });
  }

  // Attach event listeners to buttons with data-src attributes
  var buttons = document.querySelectorAll("div[data-src]");
  buttons.forEach(function (button) {
    button.addEventListener("click", handleButtonClick);
  });

  //random spheres

  function randomSpheres() {
    const stars = new THREE.SphereGeometry(0.01, 8, 8);
    const color = new THREE.Color(Math.random() * 0xffffff);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 2,
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

    const shouldAnimateDepth = Math.random() >= 0.4; // Determine if the sphere should animate its depth
    let originalScale = group.scale.clone(); // Store the original scale for reference
    const scaleSpeed = 0.2; // Speed for lerping scale

    function updateSphere() {
      const data = analyser.getAverageFrequency(); // Retrieve average frequency data
      const depthScale = 1 + data / 200; // Adjust the divisor to control the depth increase speed
      const scale = shouldAnimateDepth ? depthScale : 1; // Set the scale based on whether depth animation should occur
      group.scale.lerp(originalScale.clone().multiplyScalar(scale), scaleSpeed); // Apply the scaled depth to the group
    }

    function animateGroup() {
      requestAnimationFrame(animateGroup);
      updateSphere();
    }
    animateGroup();
  }
  Array(1500).fill().forEach(randomSpheres);

  moveCamera();

  function moveCamera() {
    requestAnimationFrame(moveCamera);

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
  }

  animate();
  window.addEventListener("resize", onWindowResize);

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    // monitored code goes here

    stats.end();
    controls.update();
    renderer.render(scene, camera);
  }

  //resize camera according to devices..
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
