/*** HTML ELEMENTS ***/
const presenterLogin = document.getElementById('presenter-login');

/*** EVENT LISTENERS ***/
presenterLogin.addEventListener("click", ()=>{
    localStorage.setItem("role", "presenter");
    location.href = "login.html";

});

/*** FUNCTIONS ***/
(function() {
    localStorage.clear();
})();