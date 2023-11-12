const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());


app.get('/',  (req, res) => {
  res.send({ fono: "fono api" });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
