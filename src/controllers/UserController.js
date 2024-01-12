const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Person = require("../models/Person");
const EmailController = require("./EmailController");
const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

class RegisterController {
  
  async createUser(req, res) {
    const { first_name, password, email } = req.body;
    const t = await sequelize.transaction();

    try {

      const salt = await bcrypt.genSalt(5);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({email: email, password: hash}, { transaction: t });
      
      const token = jwt.sign({ id_token: user.user_id }, process.env.secretKey, { expiresIn: "20d" });
      //const sendEmail = await EmailController.welcome(email, first_name);
      
      await t.commit();
      return res.send({ token, name: first_name, message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(error?.parent?.code == 23505 ? 409 : 500)?.send({ message: "Ocorreu um erro: ", code: error?.parent?.code });
    }
  }

  async Info(req, res) {
    const user_id = req.parameters.user;

    user = await User.findByPk(user_id);

    return res.send(user);
  }

}

module.exports = new RegisterController();

