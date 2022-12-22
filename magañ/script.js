console.log('%c👋', 'color: #36393e; font-size: 30px;');

var loadedItems = 0;
async function loadList() {
    let url = 'https://gist.githubusercontent.com/SegoCode/201ffdebe72a17cc94519cdc4362fbef/raw/4305e279c2a4c3cadd9642512d2925feb3a35ed6/data.json';
    let objData = await (await fetch(url)).json();
    let loadedItemsGoal = loadedItems + 50;

    for (var i = loadedItems; i < loadedItemsGoal; i++) {
        try {
            document.getElementById('magaList').innerHTML += `
                <div class="card-container">
                    <div class="card" onclick="window.open('${objData[i].url_listadoManga}', '_blank');">
                        <div class="card-content" style="background-image: url('${objData[i].images.webp.image_url}');"></div>
                    </div>
                    <div>${objData[i].title_spanish}</div>
                </div>
        `;
        } catch (error) {
            //Fix url_listadoManga undefine para mangas no listados
        }
    }
    loadedItems = loadedItems + 50;
    window.addEventListener("scroll", handleInfiniteScroll);


    const mangaList = document.getElementById("mangaGender"); // Get the mangaList div from the HTML document
    const genres = new Set(); // Create a Set to store the unique genres

    // Loop through the JSON array and add each genre to the Set, if the manga has genres
    for (const manga of objData) {
      if (manga.hasOwnProperty("genres")) {
        for (const genre of manga.genres) {
          genres.add(genre.name);
        }
      }
    }
    
    // Loop through the unique genres and create a button for each one
    for (const genre of genres) {
      const button = document.createElement("button"); // Create a new button element
      button.classList.add("tag"); // Add the "tag" class to the button
      button.textContent = genre; // Set the text content of the button to the genre name
      mangaList.appendChild(button); // Append the button to the mangaList div
    }

    
}

const handleInfiniteScroll = () => {
    if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight-500)){
        loadList();
        window.removeEventListener("scroll", handleInfiniteScroll);
    } 
}

//init
loadList();
window.addEventListener("scroll", handleInfiniteScroll);

