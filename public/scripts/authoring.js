import Config from "./modules/server-com.js";
import { parsePresentation, parseSlides } from "./modules/parser.js";

/*** HTML ELEMENTS ***/
const presentationTitle = document.getElementById("presentation-title");
const editor = document.getElementById("editor");
const slidesPreview = document.getElementById("slides-preview");
const save = document.getElementById("save");
const dash = document.getElementById("dash");
const start = document.getElementById("start");

// Dialogs
const invalidTheme = document.getElementById("invalidTheme");
const themeList = document.getElementById("theme-list");
const invalidOkBtn = document.getElementById("invalidOkBtn");



/*** GLOBAL VARIABLES ***/
let currentPresentation = null;
let parsedPresentation = {};
let currentTheme = "";
const themes = ["generic", "default", "basic"];

/*** EVENT LISTENERS ***/
editor.addEventListener("input", () => {
    parsedPresentation = parsePresentation(editor.value);
    parseSlides(slidesPreview, parsedPresentation, currentTheme);
});

save.addEventListener("click", () => {
  parsedPresentation = parsePresentation(editor.value);
  setTheme();
  parseSlides(slidesPreview, parsedPresentation, currentTheme);
});

dash.addEventListener("click", () => {
  console.log("Check for save before returning to dashboard");
});

/*** FUNCTIONS ***/
(async function () {
  await getPresentation();

  parseSlides(slidesPreview, parsedPresentation, currentTheme);
})();



async function getPresentation() {
  let url = new URLSearchParams(location.search);
  let pid = url.get("pid");
  let uid = localStorage.getItem("user_id");
  let idtoken = window.btoa(`${pid}:${uid}`);

  let presentation = await fetch(
    `/getPresentation/${idtoken}`,
    new Config("get", "", localStorage.getItem("sillytoken")).cfg
  );
  currentPresentation = await presentation.json();

  if (presentation.status === 200) {
    presentationTitle.innerText = currentPresentation.presentation_title;
    editor.value = currentPresentation.markdown;
    parsedPresentation = parsePresentation(editor.value);
    setTheme();
    console.log(currentTheme);
  } else {
    console.log(currentPresentation.message);
  }
}

function setTheme() {
  currentTheme = parsedPresentation.options.theme;

  // Check to see if currentTheme is valid
  let themeIsValid = themes.some((el) => el === currentTheme);
  if (!themeIsValid) {
    // Show valid themes in theme list
    for (let theme of themes) {
      let el = document.createElement("li");
      el.innerHTML = theme;
      themeList.appendChild(el);
    }
    invalidTheme.showModal();
    currentTheme = "default";
  }
}
