const { z, ZodError } = require("zod");
const Protocol = require("../models/Protocol");

class ProtocolController {
    async create(req, res) {
        const createSchema = z.object({
            doc_id: z.number().int().positive().optional(),
            name: z.string().max(150),
            description: z.string().max(255),
        });

        try {
            const protocol = await Protocol.create(createSchema.parse(req.body));

            if (protocol) {
                return res.status(200).send(protocol);
            }

            return res.status(400).send("Protocol could not be created");
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : "Server Error");
        }
    }

    async info(req, res) {

        try {
            const protocol = await Protocol.findByPk(req.params.id);

            if (protocol) {
                return res.status(200).send(protocol);
            }

            return res.status(404).send({ message: "Protocol not found" });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : "Server Error");
        }
    }
    
    async update(req, res) {
        const updateSchema = z.object({
            name: z.string().max(150).optional(),
            description: z.string().max(255).optional(),
        });

        try {

            const protocol = Protocol.findByPk(req.params.id)
                .then((pro) => pro.update(updateSchema.parse(req.body)));

            if (protocol) {
                return res.status(200).send(protocol);
            }

            return res.status(422).send({ message: "Protocol could not be updated" });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : "Server Error");
        }
    }

    
}

module.exports = new ProtocolController();