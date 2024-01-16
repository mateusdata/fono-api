const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const EmailController = require("./EmailController");
const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const { z, ZodError } = require('zod');

class UserController {

  async createUser(req, res) {
    const userSchema = z.object({
      first_name: z.string().max(150),
      password: z.string().max(150),
      email: z.string().email().max(150),
    });

    const t = await sequelize.transaction();

    try {
      const { first_name, password, email } = userSchema.parse(req.body);

      const salt = await bcrypt.genSalt(5);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({ email: email, password: hash, roles: ['doctor'] }, { transaction: t });

      const token = jwt.sign({ id_token: user.user_id }, process.env.secretKey, { expiresIn: "20d" });
      //const sendEmail = await EmailController.welcome(email, first_name);

      await t.commit();
      res.send({ token, name: first_name, message: "User has been created" });
    } catch (error) {
      console.log(error);
      await t.rollback();
      res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  async update(req, res) {
    const user = await User.findByPk(req.params.id);
    const { email } = req.body;

    try {
      user.update({ email });

      res.send('User has been updated');
    } catch (error) {
      res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  async info(req, res) {
    const user_id = req.params.id;

    const user = await User.findByPk(user_id, { attributes: ['use_id', 'email', 'created_at', 'updated_at'] });

    if (user) {
      res.send(user);
    }
    
    res.status(500).send({ message: 'User not found' });
  }

}

module.exports = new UserController();

