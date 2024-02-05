const express = require("express");
const rateLimiter = require("express-rate-limit");
const cors = require("cors");
const app = express();
const AuthRouter = require("./src/routes/auth");
const ApiRouter = require("./src/routes/api");
const path = require("path");
const port = process.env.PORT || 3000;
var fs = require('fs');

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
  res.send({ projeto: "Fono App api v1"});
});


app.use('/videos/', express.static('public/videos'));
 
app.get('/show-videos', function(req, res) {
  fs.readdir('public/videos', function(err, files) {
      if (err) {
          res.send('Erro ao ler o diretório');
      } else {
          res.send(files);
      }
  });
}); 

app.get('/total-videos', function(req, res) {
  fs.readdir('public/videos', function(err, files) {
      if (err) {
          res.send('Erro ao ler o diretório');
      } else {
          res.send('Quantidade de vídeos: ' + files.length);
      }
  });
});
app.listen(port, () => {
   console.log("Servidor rodando na porta " + port);
});