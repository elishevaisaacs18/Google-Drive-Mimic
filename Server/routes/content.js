var express = require("express");
var router = express.Router();
const path = require("path");
const Joi = require("joi");
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

router.get(`/user/:userId`, async function (req, res, next) {
  const userId = req.params.userId;
  try {
    const result = await findContentBy("userId", userId);
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

router.get("/:id/info", async function (req, res, next) {
  const id = req.params.id;
  try {
    console.log('GET INFO', id)
    const result = await findContentBy("id", id);
    console.log('id: ', id)
    console.log('result: ', result)
    const data = await readFile(path.join(__dirname, result[0].link), "utf-8");
    console.log('data: ', data)
    // res.writeHead(200, { "Content-Type": "text/plain" });
    res.send(data);
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
    data["content"].find((content) => content.id == id).name = req.body.name;
    console.log("data: ", data);
    //   const updatedContent = data.content.filter((content) => content.id !== id);
    //   data.content = updatedContent;
    await writeFile(
      path.join(__dirname, "../resources/content.json"),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    const newFile = data["content"].find((content) => content.id == id);
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

router.post("/", async (req, res) => {
  try {
    const schema = Joi.object({
      userId: Joi.required(),
      name: Joi.required(),
      currFolder: Joi.required(),
      link: Joi.required(),
    });
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details[0].message);
    }
    const addedUser = await addContent(req.body);
    res.status(200).send(addedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

async function addContent(reqBody) {
    const filePath = path.join(__dirname, "../resources/content.json");
  
    try {
      const rawData = await readFile(filePath, "utf-8");
      const data = JSON.parse(rawData);
      const newId = data.content.length + 1;
  console.log(reqBody)
      const newContent = {
        id: `${newId}`,
        userId: reqBody.userId,
        name: reqBody.name,
        currFolder: reqBody.currFolder,
        link: reqBody.link,
        deleted: false,
      };
  
      data.content.push(newContent);
  
      await writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        "utf-8"
      );
  
      return newContent;
    } catch (error) {
      // Log or handle the error appropriately
      console.error(error); // Log the error details
      throw new Error(`Error adding content: ${error.message}`);
    }
  }

module.exports = router;
