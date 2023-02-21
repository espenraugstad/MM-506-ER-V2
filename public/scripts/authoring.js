import Config from "./modules/server-com.js";

/*** HTML ELEMENTS ***/
const presentationTitle = document.getElementById('presentation-title');
const editor = document.getElementById('editor');
const slidesPreview = document.getElementById('slides-preview');
const save = document.getElementById('save');
const dash = document.getElementById('dash');
const start = document.getElementById('start');

/*** GLOBAL VARIABLES ***/
let currentPresentation = null;
let slides = [];

/*** EVENT LISTENERS ***/
save.addEventListener("click", ()=>{
    parsePresentation();
})

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
    //parsePresentation();
}

function parsePresentation(){
    let raw = marked.parse(editor.value);

    // Split by hr's
    let rawInputs = raw.split("<hr>");

    // First input will be global options if it contains comments
    let globalOptions = {
        theme: ""
    };
    if(rawInputs[0].includes("<!--")){
        // Input contains global options for this presentation
        // Split on newline to get all properties
        let rawProperties = rawInputs[0].split("\n");
        // Filter out all relevant properties
        for(let rawEl of rawProperties){
            if(rawEl.split(":").length > 1){
                // The first element of the split is a property key, second is the property value
                let possibleKey = rawEl.split(":")[0].toLowerCase().trim();
                let possibleValue = rawEl.split(":")[1].toLowerCase().trim();

                // Check if the possible key is in the keys of the global options object
                if(Object.keys(globalOptions).some(el => el === possibleKey)){
                    globalOptions[possibleKey] = possibleValue;
                } else {
                    console.log("Invalid key");
                }
            }
        }

        slides = rawInputs.slice(1); 


    } else {
        slides = rawInputs;
    }

    slidesPreview.innerHTML = slides.join("");
    console.log(slides);
    console.log(globalOptions);
}