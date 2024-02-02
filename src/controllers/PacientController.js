const { z, ZodError } = require('zod');
const Pacient = require('../models/Pacient');
const Protocol = require('../models/Protocol');
const Person = require('../models/Person');

class PacientController {
    async create(req, res) {
        const createSchema = z.object({
            first_name: z.string().max(150),
            last_name: z.string().max(150),
            cpf: z.string().length(11)/*.refine(cpfValidation, { message: 'Invalid cpf number' })*/,
            birthday: z.string().max(25)//.refine(validAge, { message: 'Age must be between 18 and 100 years old' })*/
        });

        try {

            const pacient = await Pacient.create({
                status: 'active',
                person: { ...createSchema.parse(req.body) }
            }, {
                include: Pacient.Person,
            });

            if (pacient) {
                return res.status(200).send(pacient);
            }

            return res.status(403).send({ message: 'Pacient could not be created' });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }

    async update(req, res) {
        const updateSchema = z.object({
            first_name: z.string().max(150).optional(),
            last_name: z.string().max(150).optional(),
        });

        try {
            const pacient = await Pacient.findByPk(req.params.id, { include: Person });

            await pacient?.update(updateSchema.parse(req.body));

            (await pacient?.getPerson()).update(updateSchema.parse(req.body));
              
            if (pacient) {
                return res.status(200).send(pacient);
            }

            return res.status(403).send({ message: 'Pacient could not be updated' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {

            const pacient = await Pacient.findByPk(req.params.id, { include: Person });

            if (pacient) {
                return res.status(200).send(pacient);
            }

            return res.status(400).send({ mensage: "Pacient not found" });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async newProtocol(req, res) {
        const protocolSchema = z.object({
            pac_id: z.number().int().positive(),
            pro_id: z.number().int().positive()
        });

        try {

            const { pac_id, pro_id } = protocolSchema.parse(req.body);

            const pacient = await Pacient.findByPk(pac_id);
            const protocol = await Protocol.findByPk(pro_id);

            if (!pacient) return res.status(404).send({ message: 'Pacient not found' });
            if (!protocol) return res.status(404).send({ message: 'Protool not found' });

            pacient.addProtocol(protocol);

            return res.status(200).send({ message: 'Protocol added to pacient' });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }
}

module.exports = new PacientController();