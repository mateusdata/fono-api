const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const EmailController = require('./EmailController');
const sequelize = require('../config/sequelize');
const { z, ZodError } = require('zod');

class UserController {

  async createUser(req, res) {
    const userSchema = z.object({
      nick_name: z.string().max(150),
      password: z.string().max(150),
      email: z.string().email().max(150),
    });

    const t = await sequelize.transaction();

    try {
      const { nick_name, password, email } = userSchema.parse(req.body);

      const salt = await bcrypt.genSalt(5);
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({ nick_name: nick_name, email: email, password: hash, roles: ['doctor'] }, { transaction: t });

      const token = jwt.sign({ id_token: user.user_id }, process.env.secretKey, { expiresIn: '20d' });
      //const sendEmail = await EmailController.welcome(email, nick_name);

      await t.commit();
      return res.send({ token, name: nick_name, message: 'User has been created' });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  async update(req, res) {
    const user = await User.findByPk(req.params.id);
    const { email } = req.body;

    try {
      user.update({ email });

      return res.statu(200).send('User has been updated');
    } catch (error) {
      return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  async info(req, res) {
    const user_id = req.params.id;

    const user = await User.findByPk(user_id, { attributes: ['use_id', 'email', 'created_at', 'updated_at'] });

    if (user) {
      return res.status(200).send(user);
    }

    return res.status(500).send({ message: 'User not found' });
  }

}

module.exports = new UserController();

