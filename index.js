const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const AuthRouter = require("./src/routes/auth");
const ApiRouter = require("./src/routes/api");
const path = require("path");
const port = process.env.PORT || 3001;
app.use("/", AuthRouter);
app.use("/", ApiRouter);
app.get("/", async function (req, res) {
  res.send({ projeto: "API fonoapp"});
});
app.use('/public', express.static(path.join(__dirname, '/public/videos')));

app.listen(3001, () => {
   console.log("Servidor rodando na porta " + 3001);
});