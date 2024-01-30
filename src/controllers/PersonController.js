const Person = require('../models/Person');
const UserHasPerson = require('../models/PersonHasUser');
const { z, ZodError } = require('zod');
const dayjs = require('dayjs');

const cpfValidation = (cpf) => {
    // Remove non-numeric characters
    const cleanedCPF = cpf.replace(/\D/g, '');

    // Check if the CPF has 11 digits
    if (cleanedCPF.length !== 11) {
        return false;
    }

    // Check if all digits are the same (invalid CPFs)
    if (/^(\d)\1+$/.test(cleanedCPF)) {
        return false;
    }

    // Calculate and validate the check digits
    const cpfArray = cleanedCPF.split('').map(Number);
    const sumFirst9Digits = cpfArray.slice(0, 9).reduce((acc, digit, index) => acc + digit * (10 - index), 0);
    const firstCheckDigit = (sumFirst9Digits * 10) % 11 === 10 ? 0 : (sumFirst9Digits * 10) % 11;

    if (cpfArray[9] !== firstCheckDigit) {
        return false;
    }

    const sumFirst10Digits = cpfArray.slice(0, 10).reduce((acc, digit, index) => acc + digit * (11 - index), 0);
    const secondCheckDigit = (sumFirst10Digits * 10) % 11 === 10 ? 0 : (sumFirst10Digits * 10) % 11;

    return cpfArray[10] === secondCheckDigit;

}

const validAge = (date) => {
    return dayjs().subtract(18, 'year').isAfter(date) && dayjs().subtract(100, 'year').isBefore(date)
}

class PersonController {

    async create(req, res) {
        const PersonSchema = z.object({
            first_name: z.string().maxLength(150),
            last_name: z.string().maxLength(150),
            cpf: z.string().length(11)/*.refine(cpfValidation, { message: 'Invalid cpf number' })*/,
            birthday: z.string().maxLength(25)//.refine(validAge, { message: 'Age must be between 18 and 100 years old' })*/
        });

        try {
            return res.status(200).send(await Person.create(PersonSchema.parse(req.body)));
        } catch (error) {
            console.log(error)
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async linkPersonToUser(req, res) {
        const { use_id, per_id } = req.body

        try {
            return res.status(200).send(await UserHasPerson.create({ use_id, per_id }));
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }

    async info(req, res) {
        try {
            const person = await Person.findByPk(req.params.id);

            if (person) {
                const users = await person.getUsers({ attributes: ['use_id', 'email', 'created_at', 'updated_at'] });

                return res.send({ person: person, users: users });
            }

            return res.status(404).send({ mensage: 'Person not found' });

        } catch (error) {

            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }

}

module.exports = new PersonController();
