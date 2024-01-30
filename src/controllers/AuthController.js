const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { z, ZodError } = require('zod');

require('dotenv').config();

class AuthController {
  async login(req, res) {
    const loginSchema = z.object({
      email: z.string().email().max(150),
      password: z.string().maxLength(50),
    });


    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await User.findOne({
        where: { email: email }
      });

      if (!user) {
        return res.status(400).json({ status: 401, message: 'User doesn\'t exists' });
      }

      const isValidUser = await bcrypt.compare(password, user.password);

      console.log(isValidUser);

      if (isValidUser) {
        const token = jwt.sign({ id_token: user.id }, process.env.secretKey, {
          expiresIn: '60s',
        });

        return res.send({ token, email: user.email, name: 'mateus' });

      } 
        
      return res.status(400).json({ status: 401, message: 'Incorrect email or password' });

    } catch (error) {

      return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  isLogged(req, res) {
    res.send('está logado sim');
  }
}

module.exports = new AuthController();
