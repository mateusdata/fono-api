const { z, ZodError } = require("zod");
const Plan = require("../models/Plan");
const User = require("../models/User");

class PlanController {

        async create(req, res) {
                const createSchema = z.object({
                        name: z.string().max(150),
                        status: z.string().max(25),
                        price: z.number().nonnegative(),
                        currency: z.enum(['BRL', 'USD']),
                        description: z.string().max(250),
                });

                try {
                        const plan = await Plan.create(createSchema.parse(req.body));

                        if (!plan) {
                                return res.status(422).send({ message: 'Plan could not be created' });
                        }

                        return res.status(201).send(plan);
                } catch (error) {
                        return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
                }

        }

        async info(req, res) {
                const plan = await Plan.findByPk(req.params.id);

                if (!plan) {
                        return res.status(404).send({ menssage: 'Plan could no be found' });
                }

                return res.status(200).send(plan);
        }

        async update(req, res) {
                const updateSchema = z.object({
                        name: z.string().max(150).optional(),
                        status: z.string().max(25).optional(),
                        price: z.number().nonnegative().optional(),
                        currency: z.enum(['BRL', 'USD']).optional(),
                        description: z.string().max(250).optional(),
                });

                try {
                        const plan = await Plan.findByPk(req.params.id).then((record) => record.update(updateSchema.parse(req.body)));

                        if (!plan) {
                                return res.status(402).send({ message: 'Plan could not be updated' });
                        }

                        return res.status(200).send(plan);
                } catch (error) {
                        return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
                }
        }

        async availablePlans(req, res) {

                const plans = await Plan.findAll({
                        attributes: { exclude: ['status', 'created_at', 'updated_at', 'deleted_at'] },
                        where: {
                                status: 'active',
                        }
                });

                return res.status(200).send(plans);
        }

        async setUserPlan(req, res) {
                const user = await User.findByPk(req.params.use_id);

                if (!user) {
                        return res.status(422).send({ message: 'User could not be found' });
                }

                const plan = await Plan.findByPk(req.params.pla_id);

                if (!plan) {
                        return res.status(422).send({ message: 'Plan could not be found' });
                }

                const planAdded = await user.addPlan(plan);

                if (!planAdded) {
                        return res.status(422).send({ message: 'Plan could not be added to user' });
                }

                return res.status(201).send({ message: 'User has a plan set' });
        }
}

module.exports = new PlanController();