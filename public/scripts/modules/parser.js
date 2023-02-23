let globalOptions = {
    theme: "default"
};

// All the slide templates
const slideGeneric = document.getElementById("slide-generic");

export function parsePresentation(markdown){
    let slides = [];

    let raw = marked.parse(markdown);

    // Split by hr's
    let rawInputs = raw.split("<hr>");

    // First input will be global options if it is a p-element
    // Check for global options
    if(rawInputs[0].includes("<p>")){
        let globalOptions = setGlobalOptions(rawInputs[0]);
        return {
            options: globalOptions,
            slides: rawInputs.slice(1)
        }
    } else {
        return {
            options: {},
            slides: rawInputs
        }
    }
}

export function parseSlides(location, parsedPresentation, currentTheme) {
    location.innerHTML = "";
  if (Object.keys(parsedPresentation.options).length !== 0) {
    for (let slide of parsedPresentation.slides) {
      // Clone slide
      let slideClone;
      switch (currentTheme) {
        case "generic":
          slideClone = slideGeneric.content.cloneNode(true);
          break;
        default:
          console.log("Not valid");
          break;
      }

      let contentDiv = slideClone.children[0];
      contentDiv.innerHTML = slide;
      location.appendChild(contentDiv);
    }
  }
}

function setGlobalOptions(element){
    // Get all the keys in the globalOptions
    let globalKeys = Object.keys(globalOptions);

    // Parse the element to extract content
    let p = new DOMParser().parseFromString(element, "text/html");
    let options = p.documentElement.textContent;

    // Put each line in an array
    let optArray = options.split("\n");

    // Loop through the array and check if the elements are valid global options, and set them accordingly
    for(let option of optArray){
        // Split the element by the colon to get key and value
        if(option.includes(":")){
            let [thisKey, thisValue] = option.split(":");
            thisKey = thisKey.toLowerCase().trim();
            thisValue = thisValue.toLowerCase().trim();
            
            // Check if this key is in the list of global object keys
            if(globalKeys.some(el => el === thisKey)){
                // This key is in the list of global keys
                globalOptions[thisKey] = thisValue;
            }
        }
    }
    return globalOptions;
}