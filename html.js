import { menu } from "./Menu";

export function pageHTML() {
  const mainDiv = document.getElementById("app");

  mainDiv.innerHTML = `
  <canvas id="canvas"></canvas>
  <div id="menu-container">
  ${menu()}
  </div>
  `;
}
