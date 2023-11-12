const express = require('express');
const cors = require('cors');
const { QueryTypes } = require('sequelize');
const sequelize = require('./src/Config/Databases/Database');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const usuarios = await sequelize.query('SELECT * FROM usuarios', {
      type: QueryTypes.SELECT,
    });

    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
