var express = require("express");
var router = express.Router();
const fsPromises = require("fs/promises");

router.get("/folder/:folderId",async function (req, res, next) {
    //get all content in folder
    const folderId = req.params.folderId;
    try {
      const result = await findContentBy("currFolder",folderId);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
});

router.get("/:id", async function (req, res, next) {
  const id = req.params.id;
  try {
    const result = await findContentBy("id", id);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

async function findContentBy(paramName, value) {
  try {
    const rawData = await fsPromises.readFile(
      `/home/hilma/HilmaCourse/Google-Drive-Mimic/Server/resources/content.json`,
      "utf-8"
    );
    const data = JSON.parse(rawData)["content"];
    let result = data.filter((content) => content[paramName] === value);
    if (!result) {
      result = {};
    }
    return result;
  } catch (err) {
    throw new Error("Unable to read file");
  }
}

module.exports = router;
