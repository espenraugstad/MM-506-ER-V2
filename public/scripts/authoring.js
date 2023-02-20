/*** HTML ELEMENTS ***/
const dash = document.getElementById('dash');

/*** EVENT LISTENERS ***/
dash.addEventListener("click", ()=>{
    console.log("Check for save before returning to dashboard");
    location.href = "presenter-dashboard.html";
})