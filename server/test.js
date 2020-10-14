const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(cors());
app.use(express.static(__dirname));

app.use(multer({ storage: storageConfig }).single("image"));
app.get("/messages", (req, res) => {
  res.send("asd");
});
app.post("/messages", function (req, res, next) {
  console.log(req.body);
  let filedata = req.file;
  if (!filedata) res.send("Ошибка при загрузке файла");
  else res.send("Файл загружен");
});
app.listen(8000, () => {
  console.log("Server started");
});
