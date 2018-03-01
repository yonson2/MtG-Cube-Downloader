const gm = require("gm");
const path = require("path");
const Promise = require("bluebird");

const [WIDTH, HEIGHT] = [72, 72];

function addBorder(image) {
  const filePath = path.resolve(image);
  return new Promise((resolve, reject) => {
    gm(image)
      .borderColor("#000")
      .border(WIDTH, HEIGHT)
      .write(newPath(filePath), err => {
        if (err) reject(err);
        resolve(newPath(filePath));
      });
  });
}

function newPath(oldPath) {
  const filePath = /(.*\/)(.*\.(?:png|jpg)).*/.exec(oldPath)[1];
  const fileName = /(.*\/)(.*\.(?:png|jpg)).*/.exec(oldPath)[2];
  return path.resolve(filePath, "with_border", fileName);
}

module.exports = { addBorder };
