var express = require("express");
var router = express.Router();
const fsPromises = require("fs/promises");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.sendFile(
    "/home/hilma/HilmaCourse/Google-Drive-Mimic/Server/resources/users.json"
  );
});

router.get("/folder/:folderId",async function (req, res, next) {
    //get all content in folder
    const id = req.params.folderId;
    try {
      const result = await findContentBy(folderId);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
    res.send();
});

router.get("/:id", async function (req, res, next) {
  const id = req.params.id;
  try {
    const result = await findContentBy(id);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
  res.send();
});

async function findContentBy(id) {
  try {
    const rawData = await fsPromises.readFile(
      `/home/hilma/HilmaCourse/Google-Drive-Mimic/Server/resources/content.json`,
      "utf-8"
    );
    const data = JSON.parse(rawData)["content"];
    let result = data.find((content) => content.id === parseInt(id));
    if (!result) {
      result = {};
    }
    return result;
  } catch (err) {
    throw new Error("Unable to read file");
  }
}

module.exports = router;
