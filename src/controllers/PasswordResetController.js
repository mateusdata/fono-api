const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const EmailController = require('./EmailController');
const { z, ZodError } = require('zod');
require('dotenv').config();

class PasswordResetController {

  async sendResetCode(req, res) {
    const sendSchema = z.object({
      email: z.string().email().max(150),
    });


    try {
      const { email } = sendSchema.parse(req.body);

      const user = await User.findOne({ where: { email }, attributes: ['email', 'use_id'] });

      if (user) {
        const code = Math.floor(Math.random() * 999999);
        let expiration = new Date(new Date().getTime() + 30 * 60000);
        const updateUser = await User.update({ verification_code: code, expiration_date: expiration }, { where: { use_id: user.use_id } })

        if (updateUser) {
          EmailController.sendResetCode(email, code);
          return res.send(user);
        }

        return res.status(400).send({ mensage: 'Error while updating' })
      }

      return res.status(404).send({ mensage: 'User has not found' });
    } catch (error) {

      return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  async verifyResetCode(req, res) {
    const { email, verification_code } = req.body;

    try {
      const user = await User.findOne({ where: { email, verification_code }, attributes: ['email', 'use_id', 'verification_code', 'expiration_date'] });

      if (user) {
        return res.send(user)
      }

      return res.status(400).send({ mensage: 'Invalid cod' });
    } catch (error) {

      return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }

  }

  async resetPassword(req, res) {
    const resetSchema = z.object({
      email: z.string().email().max(150),
      newPassword: z.string().max(50)
    });



    try {
      const { email, newPassword } = resetSchema.parse(req.body);

      const user = await User.findOne({ where: { email }, attributes: ['email', 'use_id'] });

      if (user) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        const updateUser = await User.update({ password: hash }, { where: { use_id: user.use_id } });

        if (updateUser) {

          EmailController.passwordChanged(email);
          res.send({ message: 'Your password has been updated' });

        }

        return res.status(400).send({ message: 'An error could not be updated' });
      }

      return res.status(400).send({ message: 'User doesn\'t exists' });

    } catch (error) {

      return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

}

module.exports = new PasswordResetController();
