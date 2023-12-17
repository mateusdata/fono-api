const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Person = require("../models/Person");
const EmailController = require("./EmailController");
const sequelize = require("../config/sequelize");

class RegisterController {
  async createPerson(req, res) {
    try {
      const user = await Person.create(req.body);
      if (user) {
        return res.status(200).send("Cadastro realizado com sucesso!");
      }
      res.status(500).send({ message: "Ocorreu um erro" });
    } catch (error) {
      res.status(500).send({ error: req.body });
      console.error(error);
    }
  }

  async createUser(req, res) {
    const { first_name, sur_name, last_name, cpf, birthday, password, email } = req.body;
    const t = await sequelize.transaction();
    
    try {
      const person = await Person.create({ first_name, sur_name, last_name, cpf, birthday }, { transaction: t });
      if (person) {
        console.log(person);
        console.log("Usuário criado com sucesso");

      }
      const salt = await bcrypt.genSalt(5);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({ per_id: person.per_id, email, password: hash }, { transaction: t });
      const token = jwt.sign({ id_token: user.user_id }, process.env.secretKey, { expiresIn: "20s" });
      const sendEmail = await EmailController.welcome(email, first_name);
      await t.commit();
      return res.send({ token, name: user.first_name, sendEmail: sendEmail, message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(error?.parent?.code == 23505 ? 409 : 500)?.send({ message: "Ocorreu um erro: ", code: error?.parent?.code });
    }
  }

}
module.exports = new RegisterController();

