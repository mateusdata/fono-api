const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { z, ZodError } = require('zod');
const Doctor = require('../models/Doctor');

require('dotenv').config();

class AuthController {
  async login(req, res) {
    const loginSchema = z.object({
      email: z.string().email().max(150),
      password: z.string().max(50),
    });


    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await User.findOne({
        where: { email: email },
        include: Doctor
      });

      if (!user) {
        return res.status(401).json({ message: 'User doesn\'t exists' });
      }

      const isValidUser = await bcrypt.compare(password, user.password);


      if (isValidUser) {
        const token = jwt.sign({ id_token: user.use_id }, process.env.secretKey, {
          expiresIn: '2d',
        });

        return res.send({ token, email: user.email, usu_id: user.use_id, doc_id: user.doctor.doc_id,  nick_name: user.nick_name });

      } 
        
      return res.status(401).json({message: 'Incorrect email or password' });

    } catch (error) {

      return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  isLogged(req, res) {
    res.send('está logado sim');
  }
}

module.exports = new AuthController();
