let globalOptions = {
  theme: "default",
};

// All the slide templates
const slideGeneric = document.getElementById("slide-generic");
const slideBasic = document.getElementById("slide-basic");

export function parsePresentation(markdown) {
  let slides = [];

  let raw = marked.parse(markdown);

  // Split by hr's
  let rawInputs = raw.split("<hr>");

  // First input will be global options if it is a p-element
  // Check for global options
  if (rawInputs[0].includes("<p>")) {
    let globalOptions = setGlobalOptions(rawInputs[0]);
    return {
      options: globalOptions,
      slides: rawInputs.slice(1),
    };
  } else {
    return {
      options: {},
      slides: rawInputs,
    };
  }
}

export function parseSlides(location, parsedPresentation, currentTheme) {
  location.innerHTML = "";
  if (Object.keys(parsedPresentation.options).length !== 0) {
    for (let slide of parsedPresentation.slides) {
      // Parsing the string to DOMs to do stuff.
      const dp = new DOMParser();
      let domSlide = dp.parseFromString(slide, "text/html");
      //console.log(domSlide.body.childNodes);

      // Select any potential images and move them out of their parent
      let imgs = domSlide.querySelectorAll("img");

      // Slides are limited to one single image

      if(imgs.length > 0){
        let img = imgs[0];

        // Check to see if there are any text nodes
/*         for(let node of domSlide.body.childNodes){
          console.log(node);

          console.log(node);

          if(node.nodeName === "#text"){
            containsText = true;
          } else {
            containsText = false;
          }
        } */

        // Get the parent element of the image
        let imgParent = img.parentElement;

        // Add the image to the domSlide
        domSlide.body.append(img);

        // Put it before its old parent element
        imgParent.before(img);

        // Remove the old parent element
        domSlide.body.removeChild(imgParent);

        // Add a class name
        //img.className = "slide-image";

        // Fetch the alt text of the image
        let imgAlt = img.alt;
        let imgOpt = parseAltText(imgAlt);
        //console.log(`Image options: ${imgOpt}`);

        // Options is empty (default)
        if(imgOpt === ""){
          img.className = "slide-basic-image";
          // If there is more than just one image, add an overlay to the image
          if(domSlide.body.childElementCount > 1){
            img.className += " text-overlay" ;
          }
        }
        
      }

      // Re-serialize the DOMs to a string.
      const ser = new XMLSerializer();
      slide = ser.serializeToString(domSlide);

      // Clone slide templates and add content.
      let slideClone;
      switch (currentTheme) {
        case "generic":
          slideClone = slideGeneric.content.cloneNode(true);
          let genericDiv = slideClone.children[0];
          genericDiv.innerHTML = slide;
          location.appendChild(genericDiv);
          break;
        case "basic":
          slideClone = slideBasic.content.cloneNode(true);
          let basicDiv = slideClone.children[0];
          basicDiv.innerHTML = slide;
          location.appendChild(basicDiv);
          break;
        default:
          console.log("Not valid");
          break;
      }
    }
  }
}

function parseAltText(text) {
  // Extract all info between @ and whitespace.
  let options = "";
  if(text.includes("[")){
    options = text.slice(text.indexOf("[") + 1, text.indexOf("]"));
  } else {
    options = "";
  }
  return options
  // Extract the actual alt text, if any
  //let actualAlt = text.replace(`[${rawStyles}]`, "");

  // Separate raw styles into an array
  //let styles = rawStyles.split(",");
  //return [styles, actualAlt];
}

function setGlobalOptions(element) {
  // Get all the keys in the globalOptions
  let globalKeys = Object.keys(globalOptions);

  // Parse the element to extract content
  let p = new DOMParser().parseFromString(element, "text/html");
  let options = p.documentElement.textContent;

  // Put each line in an array
  let optArray = options.split("\n");

  // Loop through the array and check if the elements are valid global options, and set them accordingly
  for (let option of optArray) {
    // Split the element by the colon to get key and value
    if (option.includes(":")) {
      let [thisKey, thisValue] = option.split(":");
      thisKey = thisKey.toLowerCase().trim();
      thisValue = thisValue.toLowerCase().trim();

      // Check if this key is in the list of global object keys
      if (globalKeys.some((el) => el === thisKey)) {
        // This key is in the list of global keys
        globalOptions[thisKey] = thisValue;
      }
    }
  }
  return globalOptions;
}
