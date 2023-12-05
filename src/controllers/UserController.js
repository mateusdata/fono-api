const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Person = require("../models/Person");
const EmailController = require("./EmailController");

class RegisterController {
  async createPerson(req, res) {
    try {
      const user  = await Person.create(req.body);
      if(user){
        return res.status(200).send("Cadastro realizado com sucesso!");
      }
      res.status(500).send({ message:"Ocorreu um erro"});
    } catch (error) {
      res.status(500).send({ error:   req.body });
      console.error(error);
    }
  }

  async createUser(req, res) {
    const {first_name, sur_name, last_name, cpf, birthday, password, email } = req.body;
    try {
      const person  = await Person.create({first_name,sur_name,last_name, cpf,birthday});
      const salt = await bcrypt.genSalt(5);
      const hash = await bcrypt.hash(password, salt);
      const user  = await User.create({per_id: person.per_id, email, password:hash});
      if (user && person) {
        const token = jwt.sign({ id_token:user.user_id}, process.env.secretKey, {
          expiresIn: "20s",
        });
         const sendEmail =  await EmailController.welcome(email,  first_name);
        return res.send({ token, name: user.first_name, sendEmail:sendEmail });
      }
      res.status(500).send("Ocorreu um erro");
    } catch (error) {
      res.status(500).send({ error: "Ocoreu um erro "  +   error.message });
      console.error(error);
    }
  }
}
module.exports = new RegisterController();

