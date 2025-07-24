//set a test to the API using abasic fetch
//fetch("https://qxplcd.ca/monster/monster.php?test=test")
   // .then(response => response.json())
    //.then(json => document.write(JSON.stringify(json)));

//basic fetch is no longer the best way to do things, instead, we use an asynchronous function

fetchData();

async function fetchData() {
    //get the data from API and put it in a variable
    //use the await to tell it to wait for the info
    const response = await fetch("https://qxplcd.ca/monster/monster.php?monsters=all");

    //the data comes back as a promise, which we have to convert to a usable object using JSON

    const json = await response.json();
    //call the function and send it to json
    createGallery(json);
}

//this function creates a gallery based on the response from asunc request

function createGallery(json) {
    //get the element to put the gallery in it
    const imgGal = document.querySelector(".images");

    //clear the HTML that's already in there
    imgGal.innerHTML = "";

    //use the object library and a loop to iterate through the json object 
    Object.values(json).forEach(monster => {
        //create a template literal to build each monster image
        const imgTemplate = 
            `<figure class="monster">
                <img src="${monster.thumb}" data-large="${monster.large}" class="galimg">
                <figcaption>${monster.species}</figcaption>
            </figure>`;
        
        //add the template to the image element
        imgGal.innerHTML += imgTemplate;
    });
}

//add an event listener to the image section and use event deligation to check if we clicked on one of the monsters thumbnails

document.querySelector(".images").addEventListener("click", function(event) {
    //event stores info about the click event so we can figure out which thing inside .images we clicked on
    if(event.target.src) {
        //craete an overlay
        
         const overlay = document.createElement("div");
        overlay.className = "overlay";

        //build a template literal to put insu=ide the overlay
        const overTemplate =
        `<img src="${event.target.dataset.large}">`;

        //add the template to the overlay
        overlay.innerHTML = overTemplate;

        //add an event listener to the overlay to destroy the overlay(a custom function we'll write)
        overlay.addEventListener("click", destroyOverlay);

        //add the overlay to the page
        document.querySelector("body").appendChild(overlay);
    }
});

//destroy overlay function

function destroyOverlay() {
    //ask the element's parent to remove it
    this.parentNode.removeChild(this)
}

//build filters using the list of trairts requested from the API
fetchFilters();

async function fetchFilters() {
    //send the query to the API and turn the data into json
    const response = await fetch("https://qxplcd.ca/monster/monster.php?traits=list");
    const json = await response.json();

    //loop through the json object, looking at both the keys and the values. The keys in this case are the categories of traits (ie. species). The values are which traits are available
    for(const [key, value] of Object.entries(json.traits)) {
       //build a template literal using the key as a header for lists of filters and each value as a radio button option the user can filter by 
       let filterTemplate = 
       `
       <article class="filter"><h3>${key}</h3><ul>
       `;

        //loop through the arrays of values and create list items which radio buttons
        for(let i=0; i<value.length; i++) {
            filterTemplate += `
            <li>
                <label><input type="radio" name="${key}" id="${key}${i}">${value[i]}</label>
            </li>`;
        }
        //now close the ul and the article to complete our template
        filterTemplate += `</ul></article>`;

        //and add the template to the filter section
        document.querySelector(".filters").innerHTML += filterTemplate;
    }
}

//add event listener to the filters, use event delgationto see if we've clicked on a radio button

document.querySelector(".filters").addEventListener("click", async function(event){
    //check to see if we clicked on one of the radio buttons
    if(event.target.name) {
        //use a template literal to build the request 
        const response = await fetch(`https://qxplcd.ca/monster/monster.php?${event.target.name}=${event.target.parentNode.textContent}`);

    const json = await response.json();

    //use the create gallery function to build a gallery with only the matching monsters
    createGallery(json);
    }
});