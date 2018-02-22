const got = require("got");
const fs = require("fs");
const Promise = require("bluebird");
const path = require("path");
const { url, folder } = require("../config");

function getCardByName(name) {
  return got(`${url}${encodeURIComponent(name)}`)
    .then(r => JSON.parse(r.body))
    .then(cardData => {
      if (cardData.image_uris) return [cardData.image_uris.large];
      if (cardData.card_faces) {
        const result = cardData.card_faces.reduce(
          (cards, card) => [card.image_uris.large, ...cards],
          []
        );
        return result;
      }
    })
    .then(cardUrls => {
      return Promise.mapSeries(cardUrls, cardUrl => {
        const fileName = /.*\/(.*\.jpg).*/.exec(cardUrl)[1];
        console.log(`Downloading ${name.trim()} as ${fileName}`);
        const cardPath = path.join(folder, fileName);
        return new Promise((resolve, reject) => {
          // cache check
          if (fs.existsSync(cardPath)) resolve(fileName);
          // Inserting 50m between requests https://scryfall.com/docs/api
          setTimeout(() => {
            const myFile = fs.createWriteStream(cardPath);
            got.stream(cardUrl).pipe(myFile);
            myFile.on("close", () => resolve(fileName));
            myFile.on("error", err => reject(err));
          }, 50);
        });
      });
    });
}

module.exports = { getCardByName };
