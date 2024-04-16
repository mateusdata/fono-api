const { z, ZodError } = require("zod");
const Person = require("../models/Person");

class AddressController {

    async create(req, res) {
        const createSchema = z.object({
            city: z.string().max(20),
            state: z.string().max(20),
            country: z.string().max(20),
            line1: z.string().max(150),
            line2: z.string().max(150),
            zip_code: z.string().length(8),
        });

        try {

            const person = await Person.findByPk(req.params.id);

            if (!person) {
                return res.status(422).send({ message: 'Person could no be found' });
            }

            const address = await person.createAddress(createSchema.parse(req.body));

            if (address) {
                return res.status(201).send(address);
            }

            return res.status(409).send({ message: 'Doctor could not be created' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }
}

module.exports = new AddressController();