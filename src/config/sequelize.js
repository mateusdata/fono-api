const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
const pg = require('pg');
require('dotenv').config();

//const user = await prisma.users.delete({ where: {id: 1}});

const sequelize = new Sequelize(
  process.env.psql,
   {
  dialect: 'postgres',
  dialectModule: pg, 
  logging: false, //essa bagaça aqui fica mostrando os logs do sequelize no terminar.
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

module.exports = sequelize;
