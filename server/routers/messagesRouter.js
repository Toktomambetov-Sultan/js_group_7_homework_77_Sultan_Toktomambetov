const express = require("express");
const { nanoid } = require("nanoid");
const filedDB = require("./filedDB");
const router = express.Router();

const errorHadler = (message) => {
  const properties = ["author", "message"];
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
  const sliceNumber = 30;
  const messages = await filedDB.get();
  const datetime = req.query.datetime;
  let answer;
  let status = 200;
  if (datetime) {
    if (isNaN(new Date(datetime))) {
      answer = { message: "Datetime query is not correct" };
      status = 400;
    } else {
      answer = messages
        .filter((item) => {
          return new Date(item.datetime) > new Date(datetime);
        })
        .slice(-sliceNumber);
    }
  } else {
    answer = messages.slice(-sliceNumber);
  }
  console.log( "\n",new Date(datetime).toString(), "\n", new Date(messages[messages.length - 1].datetime).toString());
  res.status(status).send(answer);
});

router.post("/", async (req, res) => {
  const errorProps = errorHadler(req.body);
  if (errorProps.length === 0) {
    const message = { message: req.body.message, author: req.body.author };
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
});

module.exports = router;
