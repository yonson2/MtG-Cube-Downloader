const _ = require("lodash");
const config = require("./config");
const { readFile } = require("./utils/fs");
const { getCardByName } = require("./utils/scryfall");
const { addBorder } = require("./utils/graphics");

readFile(config.source)
  .then(data =>
    data
      .toString()
      .split("\n")
      .slice(0, -1)
  )
  .tap(() => console.log("Starting download"))
  .tap(() => console.time("Download time"))
  .mapSeries(card => getCardByName(card))
  .tap(() => console.timeEnd("Download time"))
  .then(_.flatten)
  .tap(() => console.log("Adding borders"))
  .tap(() => console.time("Borders"))
  .map(addBorder)
  .tap(() => console.timeEnd("Borders"))
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    process.exit();
  });
