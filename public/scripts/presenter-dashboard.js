import Config from "./modules/server-com.js";

/*** HTML ELEMENTS ***/
const username = document.getElementById("username");
const newPresentation = document.getElementById("new");
const edit = document.getElementById("edit");
const run = document.getElementById("run");
const logout = document.getElementById("logout");
const presentationsList = document.getElementById("presentations-list");

/*** GLOBAL VARIABLES ***/
let presentations = [];
let selectedPresentationId = -1;

/*** EVENT LISTENERS ***/
newPresentation.addEventListener("click", () => {
  location.href = "authoring.html";
});

edit.addEventListener("click", ()=>{
  if(selectedPresentationId !== -1){
    location.href = `authoring.html?pid=${selectedPresentationId}`;
  }
});

logout.addEventListener("click", () => {
  localStorage.clear();
  location.href = "index.html";
});

/*** FUNCTIONS ***/
(async function () {
  username.innerHTML = localStorage.getItem("user_name");

  // Retrieve presentations
  let getPresentations = await fetch(
    "/getPresentations",
    new Config("get", "", localStorage.getItem("sillytoken")).cfg
  );

  if (getPresentations.status === 200) {
    let data = await getPresentations.json();
    presentations = data;
    listPresentations();
  } else {
    console.log(`An error occurred, status ${getPresentations.status}`);
  }
})();

function listPresentations() {
  presentationsList.innerHTML = "";
  for (let p of presentations) {
    let presentationDiv = document.createElement("div");
    presentationDiv.classList.add("presentation-item");

    // Title div
    let titleDiv = document.createElement("div");
    titleDiv.innerHTML = p.presentation_title;

    // Delete div
    let deleteDiv = document.createElement("div");
    deleteDiv.innerHTML = "X Delete";

    presentationDiv.appendChild(titleDiv);
    presentationDiv.appendChild(deleteDiv);

    // Event listeners
    titleDiv.addEventListener("click", () => {
      //console.log(`Selecting presentation ${p.presentation_title} with id ${p.presentation_id}`);
      if (selectedPresentationId !== p.presentation_id) {
        selectedPresentationId = p.presentation_id;
        // Remove selected-presentation class from any other divs that may have them
        let activeDivs = document.querySelectorAll(".selected-presentation");
        for (let active of activeDivs) {
          active.classList.remove("selected-presentation");
        }
        presentationDiv.classList.add("selected-presentation");

        // Make the edit and run buttons more visible
        edit.classList.remove("inactive");
        run.classList.remove("inactive");
      } else {
        selectedPresentationId = -1;
        presentationDiv.classList.remove("selected-presentation");
        // Make the edit and run buttons less visible
        edit.classList.add("inactive");
        run.classList.add("inactive");
      }
    });

    deleteDiv.addEventListener("click", () => {
      console.log(
        `Deleting presentation ${p.presentation_title} with id ${p.presentation_id}`
      );
    });

    presentationsList.appendChild(presentationDiv);
  }
}
