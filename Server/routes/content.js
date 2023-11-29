var express = require("express");
var router = express.Router();
const path = require("path");
const { readFile, writeFile } = require("fs/promises");

router.get("/folder/:folderId", async function (req, res, next) {
  const folderId = req.params.folderId;
  try {
    const result = await findContentBy("currFolder", folderId);
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

router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  try {
    const contentToDelete = await findContentBy("id", id);
    if (contentToDelete.length === 0) {
      return res.status(404).send("Content not found");
    }
    const rawData = await readFile(
      path.join(__dirname, "../resources/content.json"),
      "utf-8"
    );
    const data = JSON.parse(rawData);
    const updatedContent = data.content.filter((content) => content.id !== id);
    data.content = updatedContent;
    await writeFile(
      path.join(__dirname, "../resources/content.json"),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    res.status(200).send(contentToDelete[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.patch("/:id", async function (req, res, next) {
    const id = req.params.id;
    try {
      const fileToRename = await findContentBy("id", id);
      if (fileToRename.length === 0) {
        return res.status(404).send("Content not found");
      }
      const rawData = await readFile(
        path.join(__dirname, "../resources/content.json"),
        "utf-8"
      );
      const data = JSON.parse(rawData);
      data["content"].find(content=>content.id == id).name = req.body.name
      console.log('data: ', data)
    //   const updatedContent = data.content.filter((content) => content.id !== id);
    //   data.content = updatedContent;
      await writeFile(
        path.join(__dirname, "../resources/content.json"),
        JSON.stringify(data, null, 2),
        "utf-8"
      );
      const newFile = data["content"].find(content=>content.id == id)
      res.status(200).send(newFile);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

async function findContentBy(paramName, value) {
  try {
    const rawData = await readFile(
      path.join(__dirname, "../resources/content.json"),
      "utf-8"
    );
    const data = JSON.parse(rawData)["content"];
    let result = data.filter((content) => content[paramName] === value);
    if (result.length === 0) {
      result = {};
    }
    return result;
  } catch (err) {
    console.error("Error reading file:", err.message);
    throw new Error("Unable to read file");
  }
}

module.exports = router;
