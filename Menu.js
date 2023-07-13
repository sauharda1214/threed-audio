export function menu(){
return`<div class="hamburger-menu">
    <input id="menu__toggle" type="checkbox" />
    <label class="menu__btn" for="menu__toggle">
      <span></span>
    </label>

    <ul class="menu__box">
      <li><div class="menu__item">
      <label id="audLabel" for="audioInput">
      Select an audio file:
      <input label="upload" name="Upload" type="file" id="audioInput">
      <br>
      <h1 id="or">OR</h1>
      </label>
      </div></li>
      <li><div class="menu__item">Browse music :
       <br>
       <select id="dropdown">
       <option value="option1">Option 1</option>
       <option value="option2">Option 2</option>
       <option value="option3">Option 3</option>
     </select>
      </div></li>
      <li>
      </li>
    </ul>
  </div>
    `

}