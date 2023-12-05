const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Person = require("../models/Person");
require('dotenv').config();

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email: email }
      });

      if (!user) {
        return res.status(400).json({ status: 401, message: "Usuário inexistente" });
      }
      const isValidUser = await bcrypt.compare(password, user.password);
      if (isValidUser) {
        const token = jwt.sign({ id_token:user.id}, process.env.secretKey, {
          expiresIn: "60s",
        });
        const person = await Person.findOne({ where: { per_id: user.per_id }, attributes: ["first_name"] });
          return res.send({ token, email:user.email, name:person.first_name});
      } else {
        return res.status(400).json({ status: 401, message: "password incorreta"});
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Ocorreu um erro no banco de dados." });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['nome', 'email', 'cargo']
      });
      res.send(users);
    } catch (err) {
      console.error("Erro ao buscar dados de usuário:", err);
      res.status(500).json({ error: "Erro ao buscar dados de usuário" });
    }
  }
  isLogged(req, res) {
    res.send("está logado sim");
  }
}

module.exports = new AuthController();
