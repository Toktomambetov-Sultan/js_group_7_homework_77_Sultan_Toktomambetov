const express = require("express");
const filedDB = require("./filedDB");
const router = express.Router();
const path = require("path");
const config = require("../config");
const multer = require("multer");
const { nanoid } = require("nanoid");
const MessageHandler = require("./messageHandler");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const errorHadler = (message) => {
  const properties = ["message"];
  const wrongProperties = [];
  const propertyHandler = (property) => {
    return typeof property === "string" && property !== "";
  };
  properties.forEach((elem) => {
    if (!propertyHandler(message[elem])) wrongProperties.push(elem);
  });
  return wrongProperties;
};

router.get("/", async (req, res) => {
  const messages = await filedDB.get();
  res.send(messages);
});

router.post(
  "/",
  (req, res, next) => {
    next();
  },
  upload.single("image"),
  (req, res) => {
    const message = new MessageHandler(req, {
      includeFields: [
        { name: "author", path: ["body", "author"], defaultValue: "Anonymus" },
        { name: "message", path: ["body", "message"] },
        { name: "image", path: ["file", "filename"] },
        { name: "id", path: [null], defaultValue: nanoid() },
        { name: "datetime", path: [null], defaultValue: new Date().toISOString() },
      ],
      requiredFields: ["message"],
    });
    if (message.getErrorProps().length === 0) {
      filedDB.add(message.getData());
      res.send({ message: "Message recorded.", datetime: message.getData().datetime });
    } else {
      res.status(400).send({
        type: "props error",
        errorProps: message.getErrorProps(),
        message: message.getErrorProps().join(" and ") + " prop(s) is(are) uncorrect.",
      });
    }
  },
);

module.exports = router;
