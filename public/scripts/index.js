/*** HTML ELEMENTS ***/
const presenterLogin = document.getElementById('presenter-login');

/*** EVENT LISTENERS ***/
presenterLogin.addEventListener("click", ()=>{
    localStorage.clear();
    localStorage.setItem("role", "presenter");
    location.href = "login.html";

})