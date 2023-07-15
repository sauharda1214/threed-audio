import danger from './images/whatsupdanger.jpg';
import dangerAud from './music/blackaway.flac'

export function songList() {
  return `
  <div id="musicList">
  <div  data-src=${dangerAud}>
  <img src=${danger}>
  <p class="truncate-text">
  Blackway & Black Caviar - "What's Up Danger"
  </p>
  </div>
<div  data-src="./music/Post Malone - Sunflower (Lyrics) ft. Swae Lee [TubeRipper.com].flac">
<img src="./images/sunflower.jpg">
<p class="truncate-text">
Post Malone, Swae Lee - Sunflower
</p>
</div>

<div  data-src="./music/Metro Boomin Coi Leray - Self Love (Spider-Man Across the Spider-Verse) [TubeRipper.com].flac">
<img src="./images/selflove.jpg">
<p class="truncate-text">
Self Love - Metro Boomin, Coi Leray
</p>
</div>

<div  data-src="./music/Metro Boomin Swae Lee Lil Wayne Offset Annihilate Spider-Man Across the Spider-Verse [TubeRipper.com].flac">
<img src="./images/anhiliate.jpg">
<p class="truncate-text">
Metro Boomin & Swae Lee, Lil Wayne, Offset 
</p>
</div>
  </div>
    
   `;
}
