const got = require("got");
const fs = require("fs");
const Promise = require("bluebird");
const shortid = require("shortid");
const path = require("path");
const { url, folder } = require("../config");

function getCardByName(name) {
  return Promise.resolve(got(`${url}${encodeURIComponent(name)}`))
    .then(r => JSON.parse(r.body))
    .then(cardData => {
      if (cardData.image_uris) return [cardData.image_uris.png];
      if (cardData.card_faces) {
        const result = cardData.card_faces.reduce(
          (cards, card) => [card.image_uris.png, ...cards],
          []
        );
        return result;
      }
    })
    .then(cardUrls => {
      return Promise.mapSeries(cardUrls, cardUrl => {
        const fileName = `${shortid.generate()}_${
          /.*\/(.*\.png).*/.exec(cardUrl)[1]
        }`;
        console.log(`Downloading ${name.trim()} as ${fileName}`);
        const cardPath = path.resolve(folder, fileName);
        return new Promise((resolve, reject) => {
          // Inserting 50m between requests https://scryfall.com/docs/api
          setTimeout(() => {
            const myFile = fs.createWriteStream(cardPath);
            got.stream(cardUrl).pipe(myFile);
            myFile.on("close", () => resolve(cardPath));
            myFile.on("error", err => reject(err));
          }, 50);
        });
      });
    });
}

module.exports = { getCardByName };
