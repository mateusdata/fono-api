const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const EmailController = require('./EmailController');
const sequelize = require('../config/sequelize');
const { z, ZodError } = require('zod');
const Doctor = require('../models/Doctor');
//const stripe = require('../services/stripeClient');

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
      const user = await User.create({
        nick_name, password, email, roles: ['doctor'],
        doctor: {
          gov_license: null,
        },
      },
        {
          transaction: t,
          include: User.Doctor
        }
      );

      const token = jwt.sign({ id_token: user.use_id }, process.env.secretKey, { expiresIn: '20d' });
      //const sendEmail = await EmailController.welcome(email, nick_name);

      await t.commit();


      const userDoc = await user.reload({ include: Doctor });
      //const costumer = await stripe.createCostumer(userDoc.use_id);

      //console.log(costumer);
      //await userDoc.createCostumer({costumer_id: costumer.id, invoice_prefix: costumer.invoice_prefix});

      return res.send({ token, user_id: userDoc.get('use_id'), nick_name: userDoc.get('nick_name'), doc_id: userDoc.get('doctor').get('doc_id'), message: 'User has been created' });
    } catch (error) {
      await t.rollback();
      
      return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  async update(req, res) {
    const updateSchema = z.object({
      nick_name: z.string().max(150).optional(),
      email: z.string().email().max(150).optional(),
    });

    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      const updated = await user.update(updateSchema.parse(req.body));

      if (!updated) {
        return res.status(403).send({ message: 'User not updated' })
      }

      return res.status(200).send({ use_id: user.use_id, email: user.email, nick_name: user.nick_name });
    } catch (error) {
      return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
    }
  }

  async info(req, res) {
    const user_id = req.params.id;

    const user = await User.findByPk(user_id, { attributes: { exclude: ['password', 'created_at', 'updated_at'] } });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res.status(200).send(user);
  }

}

module.exports = new UserController();

