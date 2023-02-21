import Config from "./modules/server-com.js";

/*** HTML ELEMENTS ***/
const presentationTitle = document.getElementById('presentation-title');
const editor = document.getElementById('editor');
const save = document.getElementById('save');
const dash = document.getElementById('dash');
const start = document.getElementById('start');

/*** GLOBAL VARIABLES ***/
let currentPresentation = null;

/*** EVENT LISTENERS ***/
dash.addEventListener("click", ()=>{
    console.log("Check for save before returning to dashboard");
    //location.href = "presenter-dashboard.html";
});


/*** FUNCTIONS ***/
(async function() {
    await getPresentation();
})();

async function getPresentation(){
    let url = new URLSearchParams(location.search);
    let pid = url.get("pid");
    let uid = localStorage.getItem("user_id");
    let idtoken = window.btoa(`${pid}:${uid}`);

    
    let presentation = await fetch(`/getPresentation/${idtoken}`, new Config("get", "", localStorage.getItem("sillytoken")).cfg);
    currentPresentation = await presentation.json();

    if(presentation.status === 200){
        console.log(currentPresentation);
        presentationTitle.innerText = currentPresentation.presentation_title; 
        editor.value = currentPresentation.markdown;
        previewPresentation();
    } else {
        console.log(currentPresentation.message);
    }
}

function previewPresentation(){
    console.log("Previewing");
}