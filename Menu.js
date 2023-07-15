import { songList } from "./songList";



export function menu(){
return`<div class="hamburger-menu">
    <input id="menu__toggle" type="checkbox" />
    <label class="menu__btn" for="menu__toggle">
      <span></span>
    </label>

    <ul class="menu__box">
    <div id="stats"></div>
      <li><div class="menu__item">
      <label id="audLabel" for="audioInput">
      Upload an audio file:
      <input  type="file" id="audioInput" accept=".mp3,.flac,.ogg,.wav,.m4a">
      <div id="progressText"></div>
      <button id="playBtn">PLAY AUDIO</button>
      <br>
      <h1 id="or">OR</h1>
      </label>
      </div></li>
      <li><div class="menu__item">Browse music :
       <br>
      </div></li>
      <li>
      <div class="menu__item">
      ${songList()}
      </div>
      </li>
    </ul>
  </div>
    `

}