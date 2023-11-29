var express = require("express");
var router = express.Router();
const fsPromises = require("fs/promises");
const Joi = require("joi");
const path = require("path");

/* GET users listing. */
router.post("/", async (req, res) => {
  console.log("hi");
  try {
    const schema = Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details[0].message);
    }
    const addedUser = await addUser(req.body);
    res.status(200).send(addedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

async function addUser(reqBody) {
  const rawData = await fsPromises.readFile(
    path.join(__dirname, "../resources/users.json"),
    "utf-8"
  );
  const data = JSON.parse(rawData);
  const userExist = data.users.find(
    (user) =>
      user.userName == reqBody.userName && user.password == reqBody.password
  );
  console.log("userExist: ", userExist);
  if (userExist) {
    return userExist;
  } else {
    const newId = data.users.length + 1;
    const newUser = {
      id: newId,
      userName: reqBody.userName,
      password: reqBody.password,
    };
    data.users.push(newUser);
    await fsPromises.writeFile(
      path.join(__dirname, "../resources/users.json"),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    return newUser;
  }
}

router.get("/", function (req, res, next) {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "../resources/users.json"));
});

router.get("/:id", async function (req, res, next) {
  const id = req.params.id;
  try {
    const result = await findUserBy(id);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

async function findUserBy(id) {
  try {
    const rawData = await fsPromises.readFile(
      path.join(__dirname, "../resources/users.json"),
      "utf-8"
    );
    const data = JSON.parse(rawData)["users"];
    let result = data.find((user) => user.id === parseInt(id));
    if (!result) {
      result = {};
    }
    return result;
  } catch (err) {
    throw new Error("Unable to read file");
  }
}

module.exports = router;
