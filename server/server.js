const express = require("express");
const cors = require("cors");
const app = express();
const messageRouter = require("./routers/messagesRouter");
const port = 8000;
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/messages", messageRouter);
app.listen(port, () => {
  console.log(`Server stared on ${port} port.`);
});
