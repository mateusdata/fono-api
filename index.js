const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const AuthRouter = require("./src/routes/auth");
const ApiRouter = require("./src/routes/api");
const port = process.env.PORT || 3001;

app.use("/", AuthRouter);
app.use("/", ApiRouter);
app.get("/", function (req, res) {
  res.send({ projeto: "API fonoapp"});
});
app.listen(port, () => {
   console.log("Servidor rodando na porta " + port);
});