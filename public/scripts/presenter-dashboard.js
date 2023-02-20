/*** HTML ELEMENTS ***/
const newPresentation = document.getElementById('new');
const logout = document.getElementById('logout');

/*** EVENT LISTENERS ***/
newPresentation.addEventListener("click", ()=>{
    location.href = "authoring.html";
})

logout.addEventListener("click", ()=>{
    location.href = "index.html";
})