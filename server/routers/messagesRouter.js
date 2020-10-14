const express = require("express");
const filedDB = require("./filedDB");
const router = express.Router();
const path = require("path");
const config = require("../config");
const multer = require("multer");
const { nanoid } = require("nanoid");

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
  const properties = [];
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
    console.log(req.files);
    next();
  },
  upload.single("image"),
  (req, res) => {
    const errorProps = errorHadler(req.body);
    if (errorProps.length === 0) {
      const message = { message: req.body.message, author: req.body.author };
      if (req.file) {
        message.image = req.file.name;
      }
      const datetime = new Date().toISOString();
      filedDB.add({ ...message, datetime, id: nanoid() });
      res.send({ message: "Message recorded.", datetime });
    } else {
      res.status(400).send({
        type: "props error",
        errorProps: errorProps,
        message: errorProps.join(" and ") + " prop(s) is(are) uncorrect.",
      });
    }
  },
);

module.exports = router;
