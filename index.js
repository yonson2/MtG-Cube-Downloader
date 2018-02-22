const config = require("./config");
const { readFile } = require("./utils/fs");
const { getCardByName } = require("./utils/scryfall");

readFile(config.source)
  .then(data => data.toString().split("\n").slice(0, -1))
  .tap(() => console.time("Download time"))
  .mapSeries(card => getCardByName(card))
  .tap(() => console.timeEnd("Download time"))
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    process.exit();
  });
