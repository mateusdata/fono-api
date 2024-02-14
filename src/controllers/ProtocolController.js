const { z, ZodError } = require('zod');
const Protocol = require('../models/Protocol');

const Exercise = require('../models/Exercise');
const ExercisePlan = require('../models/ExercisePlan');

class ProtocolController {
    async create(req, res) {
        const createSchema = z.object({
            doc_id: z.number().int().positive(),
            ses_id: z.number().int().positive(),
            name: z.string().max(150),
            description: z.string().max(255),
            exercise_plans: z.object({
                exe_id : z.number().int().positive(),
                series : z.number().int().positive(),
                repetitions: z.number().int().positive(),
            }).array().optional(),
        });

        try {
            const protocol = await Protocol.create(
                createSchema.parse(req.body),
                {
                    include: Protocol.ExercisePlan
                }
            );

            if (protocol) {
                return res.status(200).send(protocol);
            }

            return res.status(400).send('Protocol could not be created');
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {
            const protocol = await Protocol.findByPk(req.params.id, {
                include: {
                    model: ExercisePlan,
                    attributes: { exclude: ['pro_id', 'exe_id', 'created_at', 'updated_at'] },
                    include: {
                        model: Exercise,
                        attributes: { exclude: ['created_at', 'updated_at'] },
                    }
                },
                attributes:{exclude:['created_at', 'updated_at']}
            });

            if (protocol) {

                return res.status(200).send(protocol);
            }

            return res.status(404).send({ message: 'Protocol not found' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async update(req, res) {
        const updateSchema = z.object({
            name: z.string().max(150).optional(),
            description: z.string().max(255).optional(),
        });

        try {

            const protocol = await Protocol.findByPk(req.params.id)
                .then((pro) => pro.update(updateSchema.parse(req.body)));

            if (protocol) {
                return res.status(200).send(protocol);
            }

            return res.status(422).send({ message: 'Protocol could not be updated' });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }


}

module.exports = new ProtocolController();