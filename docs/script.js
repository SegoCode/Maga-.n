console.log('%c👋', 'color: #36393e; font-size: 30px;');

let firstLoad = true;
let loadedItems = 0;
let realLoaded = 0;

async function loadList() {
    const url = 'https://raw.githubusercontent.com/SegoCode/Maga-.n/main/database/db.json';
    const objData = await (await fetch(url)).json();
    let loadedItemsGoal = loadedItems + 50;
    const searchParams = new URLSearchParams(window.location.search);
    const genderParam = searchParams.get("gender");

    for (let i = loadedItems; i < loadedItemsGoal; i++) {
        let addCard = false;

        if (genderParam && objData[i].hasOwnProperty("genres")) {
            addCard = objData[i].genres.some(genre => genre.name === genderParam);
        } else {
            addCard = true;
        }

        if (addCard) {
            try {
                document.getElementById('magaList').innerHTML += `
                    <div class="card-container">
                        <div class="card" onclick="window.open('${objData[i].url_listado_manga}', '_blank');">
                            <div class="card-content" style="background-image: url('${objData[i].images.webp.image_url}');"></div>
                        </div>
                        <div>${objData[i].title_spanish}</div>
                    </div>
                `;
                realLoaded++;
            } catch (error) {
                // Fix url_listado_manga undefined for unlisted mangas
            }
        }
    }

    loadedItems += 50;
    window.addEventListener("scroll", handleInfiniteScroll);

    if (loadedItems < objData.length && realLoaded < 50) {
        loadList();
    }

    if (firstLoad) {
        const genres = new Set();
        for (const manga of objData) {
          if (manga.hasOwnProperty("genres")) {
            for (const genre of manga.genres) {
              genres.add(genre.name);
            }
          }
        }
        const mangaList = document.getElementById("mangaGender");
      
        // Create a "Clear Selection" button
        const clearButton = document.createElement("button");
        clearButton.classList.add("tag");
        clearButton.textContent = "All";
        clearButton.style.display = genderParam ? "inline-block" : "none";
        clearButton.addEventListener("click", () => {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.delete("gender");
          window.history.replaceState({}, "", currentUrl.toString());
          location.reload();
        });
        mangaList.appendChild(clearButton);
      
        for (const genre of genres) {
          const button = document.createElement("button");
          button.classList.add("tag");
      
          // Add the "tag-checked" class to the selected genre button
          if (genre === genderParam) {
            button.classList.add("tag-checked");
          }
      
          button.textContent = genre;
          button.addEventListener("click", () => {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("gender", genre);
            window.history.replaceState({}, "", currentUrl.toString());
            location.reload();
          });
          mangaList.appendChild(button);
        }
      
        firstLoad = false;
      }
    }

const handleInfiniteScroll = () => {
    if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 500)) {
        document.getElementById('spinner').style.display = 'block';
        loadList();
        document.getElementById('spinner').style.display = 'none';
        window.removeEventListener("scroll", handleInfiniteScroll);
        realLoaded = 0;
    }
}

// Initialize
loadList();
window.addEventListener("scroll", handleInfiniteScroll);
