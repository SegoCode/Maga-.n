'use strict';

import got from 'got';
import fs from 'fs';

const rawdata = fs.readFileSync('listado_manga_db.json');
const mangasEspanol = JSON.parse(rawdata);

const updateMangaData = async (manga) => {
  try {
    const subResponse = await got(`https://api.jikan.moe/v4/manga?limit=1&q=${manga.name_original}`);
    const objResponse = JSON.parse(subResponse.body);
    delete manga.name_original;

    objResponse.data[0].titles.push({
      type: 'Spanish',
      title: manga.title_spanish,
    });

    objResponse.data[0].title_synonyms.push(manga.title_spanish);

    return {
      ...manga,
      url_myanimelist: objResponse.data[0].url,
      title: objResponse.data[0].title,
      title_english: objResponse.data[0].title_english,
      title_japanese: objResponse.data[0].title_japanese,
      title_synonyms: objResponse.data[0].title_synonyms,
      ...objResponse.data[0],
    };
  } catch (error) {
    console.error(`Missing :( -> ${error}`);
    return null;
  }
};

(async () => {
  const updatedMangas = [];
  let errorCount = 0;

  for (const manga of mangasEspanol) {
    const updatedManga = await updateMangaData(manga);
    if (updatedManga) {
      updatedMangas.push(updatedManga);
    } else {
      errorCount++;
    }

    console.log(`Done updating ${manga.title_spanish}.`);
    await new Promise((r) => setTimeout(r, 2000));
    break
  }

  fs.writeFileSync('./data.json', JSON.stringify(updatedMangas, null, 2), 'utf-8');
  console.log(`Numbers of mangas not updated: ${errorCount}`);
})();