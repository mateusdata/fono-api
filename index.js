const express = require('express');
const cors = require('cors');
const sequelize = require('./src/Config/Databases/Database');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.get('/users', async (req, res) => {
  try {
    const usuarios = await sequelize.query('SELECT * FROM usuarios');
    res.send(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
});

app.get('/',  (req, res) => {
  res.send({ fono: "fono api" });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
