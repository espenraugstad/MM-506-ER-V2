/*** HTML ELEMENTS ***/
const username = document.getElementById('username');
const newPresentation = document.getElementById('new');
const logout = document.getElementById('logout');

/*** GLOBAL VARIABLES ***/
let presentations = [];

/*** EVENT LISTENERS ***/
newPresentation.addEventListener("click", ()=>{
    location.href = "authoring.html";
});

logout.addEventListener("click", ()=>{
    location.href = "index.html";
});

/*** FUNCTIONS ***/
(function() {
    username.innerHTML = localStorage.getItem("user_name");

    // Retrieve presentations

})();