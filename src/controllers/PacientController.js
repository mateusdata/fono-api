const { z, ZodError } = require('zod');
const Pacient = require('../models/Pacient');
const Protocol = require('../models/Protocol');
const Person = require('../models/Person');
const ExercisePlan = require('../models/ExercisePlan');
const sequelize = require('../config/sequelize');
const Doctor = require('../models/Doctor');
const { Op, Sequelize } = require('sequelize');
const Session = require('../models/Session');
const Exercise = require('../models/Exercise');
const Questionnaire = require('../models/Questionnaire');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Section = require('../models/Section');

class PacientController {
    async create(req, res) {
        const createSchema = z.object({
            doc_id: z.number().positive(),
            first_name: z.string().max(150),
            last_name: z.string().max(150),
            cpf: z.string().length(11)/*.refine(cpfValidation, { message: 'Invalid cpf number' })*/,
            birthday: z.string().max(25)/*.refine(validAge, { message: 'Age must be between 18 and 100 years old' })*/,
            base_diseases: z.string().max(300).optional(),
            consultation_reason: z.string().max(300).optional(),
            food_profile: z.string().max(300).optional(),
            chewing_complaint: z.string().max(300).optional(),
            education: z.string().max(300).optional(),
        });
        const t = await sequelize.transaction();

        try {

            const pacient = await Pacient.create({
                status: 'active',
                ...createSchema.parse(req.body),
                person: { ...createSchema.parse(req.body) },
            }, {
                include: Pacient.Person,
            });

            await t.commit();

            if (pacient) {
                pacient.addDoctor(await Doctor.findByPk(req.body.doc_id));
                return res.status(200).send(pacient);
            }
        } catch (error) {
            await t.rollback();
            
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }

    async update(req, res) {
        const updateSchema = z.object({
            first_name: z.string().max(150).optional(),
            last_name: z.string().max(150).optional(),
            base_diseases: z.string().max(300).optional(),
            consultation_reason: z.string().max(300).optional(),
            food_profile: z.string().max(300).optional(),
            chewing_complaint: z.string().max(300).optional(),
            education: z.string().max(300).optional(),
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
            
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {

            const pacient = await Pacient.findByPk(req.params.id, {
                include: [Person],

            });

            const questionnaires = await Questionnaire.findAll({
                attributes: { exclude: ['created_at', 'updated_at'] },
                include: {
                    model: Section,
                    attributes: { exclude: ['created_at', 'updated_at'] },
                    required: true,
                    include: {
                        model: Question,
                        attributes: { exclude: ['qhs_id', 'created_at', 'updated_at'] },
                        required: true,
                        include: {
                            model: Answer,
                            attributes: { exclude: ['que_id', 'pac_id', 'created_at', 'updated_at'] },
                            required: true,
                            include: {
                                model: Pacient,
                                attributes: [],
                                required: true,
                                where: {
                                    pac_id: req.params.id
                                }
                            }
                        }
                    }
                }
            });


            if (pacient) {
                return res.status(200).send({ ...pacient.get(), questionnaires });
            }

            return res.status(400).send({ mensage: "Pacient not found" });
        } catch (error) {
            
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async attachProtocol(req, res) {
        const protocolSchema = z.object({
            pac_id: z.number().int().positive(),
            pro_id: z.number().int().positive()
        });

        try {

            const { pac_id, pro_id } = protocolSchema.parse(req.body);

            const pacient = await Pacient.findByPk(pac_id);
            const protocol = await Protocol.findByPk(pro_id, { include: ExercisePlan, attributes: { exclude: ['pro_id', 'exp_id'] } });


            if (!pacient) return res.status(404).send({ message: 'Pacient not found' });
            if (!protocol) return res.status(404).send({ message: 'Protocol not found' });

            pacient.addProtocol(protocol);

            return res.status(200).send({ message: 'Protocol added to pacient' });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async search(req, res) {

        // Make sure to not return pacient from other doctors
        try {

            const pacients = await Person.findAll({
                attributes: { exclude: ['created_at', 'updated_at'] },
                include: {
                    model: Pacient,
                    required: true,
                    attributes: { exclude: ['created_at', 'updated_at'] },
                    include: {
                        model: Doctor,
                        where: {
                            doc_id: req.body.doc_id
                        },
                        through: {
                            attributes: []
                        }
                    }
                },
                where: {
                    [Op.or]: [
                        {
                            first_name: {
                                [Op.match]: Sequelize.fn('to_tsquery', req.body.search.replaceAll(/\s+/g, " | "))
                            }
                        },
                        {
                            last_name: {
                                [Op.match]: Sequelize.fn('to_tsquery', req.body.search.replaceAll(/\s+/g, " | "))
                            }
                        },
                        {
                            cpf: {
                                [Op.like]: `%${req.body.search}%`
                            }
                        },
                    ]
                }

            });

            if (pacients) {
                return res.status(200).send(pacients);
            }

            return res.status(400).send({ mensage: 'Pacient not found' });
        } catch (error) {
            
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async currentProtocol(req, res) {

        const listSchema = z.object({
            pageSize: z.coerce.number().positive(),
            page: z.coerce.number().positive(),
        });

        try {

            const { pageSize, page } = listSchema.parse(req.query);

            const limit = pageSize; // number of records per page
            const offset = (page - 1) * pageSize;

            const protocol = await Pacient.findAndCountAll({
                include: {
                    model: Session,
                    include: {
                        model: Protocol,
                        include: {
                            model: ExercisePlan,
                            include: Exercise,
                            required: true
                        },
                        required: true
                    },
                    limit: 1,
                },
                where:{
                    pac_id : req.params.id
                }

            });

            return res.status(200).send(protocol);
        } catch (error) {

            
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }
}

module.exports = new PacientController();