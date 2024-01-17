const express = require("express");
const rateLimiter = require("express-rate-limit");
const cors = require("cors");
const app = express();
const AuthRouter = require("./src/routes/auth");
const ApiRouter = require("./src/routes/api");
const path = require("path");
const port = process.env.PORT || 3001;

app.use(rateLimiter({
  windowMs: 1000,
  max: 300,
  standardHeaders: 'draft-7',
	legacyHeaders: false,
}));

app.use(express.json());
app.use(cors());
app.use("/", AuthRouter);
app.use("/", ApiRouter);

app.get("/", async function (req, res) {
  res.send({ projeto: "API fonoapp"});
});

app.listen(port, () => {
   console.log("Servidor rodando na porta " + port);
});