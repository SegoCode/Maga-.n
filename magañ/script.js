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

