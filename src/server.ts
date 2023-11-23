import express from 'express';
//import sequelize from './src/Config/Databases/Database';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

/*
app.get('/users', async (req, res) => {
  try {
    const usuarios = await sequelize.query('SELECT * FROM usuarios');
    res.send(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
});
*/

app.get('/', async (req, res) => {
  res.send({fono:"fono api teste", version:1.0});
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
