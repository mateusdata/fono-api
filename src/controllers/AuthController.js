const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const { z, ZodError } = require('zod');

require('dotenv').config();

class AuthController {
  async login(req, res) {
    const loginSchema = z.object({
      email: z.string().email().max(150),
      password: z.string().max(50),
    });

    const { email, password } = loginSchema.parse(req.body);

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
        
        return res.send({ token, email:user.email, name: 'mateus'});
        
      } else {

        return res.status(400).json({ status: 401, message: "Incorrect email or password"});

      }
    } catch (err) {
      console.error(err);
      res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  isLogged(req, res) {
    res.send("está logado sim");
  }
}

module.exports = new AuthController();
