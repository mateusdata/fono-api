const { z, ZodError } = require('zod');
const User = require('../models/User');
const Person = require('../models/Person');
const whois = require('../services/IdentityService');
const sequelize = require('../config/sequelize');
const Phone = require('../models/Phone');

class PhoneNumberController {


    async create(req, res) {
        const createSchema = z.object({
            phone: z.string().max(13).min(11).regex(/(\d{3})?\d{2}\d{9}/)
        });

        const t = await sequelize.transaction();

        try {
            const { phone } = createSchema.parse(req.body);

            let user = await User.findByPk(whois(req), { include: { model: Person } });

            const matches = RegExp(/(\d{3})?(\d{2})(\d{9})/).exec(phone);

            user = await user.reload({ include: Person });

            const phoneNumber = await Phone.create({ per_id: user?.person?.per_id, ddd: matches[2], number: matches[3] });

            await t.commit();

            if (!phoneNumber) {
                return res.status(500).send({ message: 'Phone could not be created' });
            }

            return res.status(200).send(phoneNumber);

        } catch (error) {
            await t.rollback();
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }
}

module.exports = new PhoneNumberController();