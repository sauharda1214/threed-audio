import danger from "./images/whatsupdanger.jpg";
import selflove from "/images/selfloveimg.jpg";
import sunflower from "./images/sunflower.jpg";
import offset from "./images/offset.jpg";
import dangerAud from "./music/blackaway.mp3";
import selfloveAud from "./music/selflove.mp3";
import sunflowerAud from "./music/sunflower.mp3";
import offsetAud from "./music/offset.mp3";

export function songList() {
  return `
  <div id="musicList">
  <div  data-src=${dangerAud}>
  <img src=${danger}>
  <p class="truncate-text">
  Blackway & Black Caviar - "What's Up Danger"
  </p>
  </div>
<div  data-src=${sunflowerAud}>
<img src=${sunflower}>
<p class="truncate-text">
Post Malone, Swae Lee - Sunflower
</p>
</div>

<div  data-src=${selfloveAud}>
<img src="${selflove}">
<p class="truncate-text">
Self Love - Metro Boomin, Coi Leray
</p>
</div>

<div  data-src=${offsetAud}>
<img src=${offset}>
<p class="truncate-text">
Metro Boomin & Swae Lee, Lil Wayne, Offset 
</p>
</div>
  </div>
    
   `;
}
