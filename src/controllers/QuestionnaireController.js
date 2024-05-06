const { z, ZodError } = require('zod');
const Question = require('../models/Question');
const Questionnaire = require('../models/Questionnaire');
const Answer = require('../models/Answer');
const QuestionnaireSection = require('../models/Section');
const Section = require('../models/Section');
const Pacient = require('../models/Pacient');
const { Op } = require('sequelize');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const whois = require('../services/IdentityService');

class QuestionnaireController {
    async create(req, res) {
        const createSchema = z.object({
            name: z.string().max(150),
            purpose: z.string().max(150),
            sections: z.object({
                name: z.string().max(150),
                questions: z.object({
                    name: z.string().max(150),
                    alternatives: z.array(z.string().max(150)),
                }).array().optional(),
            }).array().optional(),
        });

        try {
            const questionnaire = await Questionnaire.create(
                createSchema.parse(req.body),
                {
                    include: [{
                        association: Questionnaire.Section,
                        include: QuestionnaireSection.Question
                    }]
                }
            );

            if (questionnaire) {
                return res.status(200).send(questionnaire);
            }

            return res.status(400).send('Questionnaire could not be created');
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {
            const questionnaire = await Questionnaire.findByPk(req.params.id, {
                include: {
                    model: Section,
                    attributes: { exclude: ['qus_id', 'created_at', 'updated_at'] },
                    include: {
                        model: Question,
                        attributes: { exclude: ['qhs_id', 'created_at', 'updated_at'] },
                    }
                },
                attributes: { exclude: ['created_at', 'updated_at'] }
            });

            if (questionnaire) {

                return res.status(200).send(questionnaire);
            }

            return res.status(404).send({ message: 'Questionnaire not found' });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async update(req, res) {
        const updateSchema = z.object({
            name: z.string().max(150).optional(),
            purpose: z.string().max(150).optional(),
            questions: z.object({
                que_id: z.number().int().positive(),
                name: z.string().max(150).optional(),
                alternatives: z.array(z.string().max(150)).optional(),
            }).array().optional(),
        });


        try {

            const questionnaire = await Questionnaire.findByPk(req.params.id, { include: Question })
                .then((pro) => pro.update(updateSchema.parse(req.body)));

            if (questionnaire) {
                return res.status(200).send(questionnaire);
            }

            return res.status(422).send({ message: 'Questionnaire could not be updated' });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async nextQuestionnaire(req, res) {
        try {
            const questionnaires = await Questionnaire.findAll({
                attributes: ['qus_id'],
                include: {
                    model: Section,
                    attributes: [],
                    required: true,
                    include: {
                        model: Question,
                        attributes: [],
                        required: true,
                        include: {
                            model: Answer,
                            required: true,
                            include: {
                                model: Pacient,
                                required: true,
                                where: {
                                    pac_id: req.params.id
                                }
                            }
                        }
                    }
                }
            });

            const nextQuestionnaire = await Questionnaire.findOne({
                where: {
                    qus_id: {
                        [Op.notIn]: questionnaires?.flatMap((record) => record.qus_id)
                    }
                },
                attributes: { exclude: ['created_at', 'updated_at'] },
                include: {
                    model: Section,
                    attributes: { exclude: ['created_at', 'updated_at'] },
                    required: true,
                    include: {
                        model: Question,
                        attributes: { exclude: ['qhs_id', 'created_at', 'updated_at'] },
                        required: true,
                    }
                }

            });

            if (!nextQuestionnaire) {
                return res.status(404).send('Questionnaire not found');
            }
    
            return res.status(200).send(nextQuestionnaire);
    
        } catch (error) {

            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async answerQuestionnaire(req, res) {
        const answerSchema = z.object({
            pac_id: z.number().int().positive(),
            answers: z.object({
                que_id: z.number().int().positive(),
                alternative: z.string().max(150)
            }).array()
        });

        try {
            const { pac_id, answers } = answerSchema.parse(req.body);

            const pacient = await Pacient.findByPk(pac_id);
            const user = await User.findByPk(whois(req), { include: [Doctor] });

            if (!pacient) {
                res.status(404).send({ message: 'Pacient not found' });
            }
       
            const created = await Answer.bulkCreate(answers.map((element) => Object({ ...element, pac_id: pacient.pac_id, doc_id: user?.doctor?.doc_id })));

            if (!created) {
                return res.status(422).send({ message: "Could not save answers" });
            }
            return res.status(201).send(created);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async answeredQuestionnaire(req, res) {

        const user = await User.findByPk(whois(req), { include: [Doctor] });

        const questionnaire = await Questionnaire.findByPk(req.params.qus_id, {
            attributes: { exclude: ['created_at', 'updated_at'] },
            include: {
                model: Section,
                attributes: { exclude: ['created_at', 'updated_at'] },
                include: {
                    model: Question,
                    attributes: { exclude: ['qhs_id', 'created_at', 'updated_at'] },
                    include: {
                        model: Answer,
                        attributes: { exclude: ['que_id', 'pac_id', 'created_at', 'updated_at'] },
                        where:{
                            doc_id: user?.doctor?.doc_id
                        },
                        include: {
                            model: Pacient,
                            attributes: [],
                            where: {
                                pac_id: req.params.pac_id
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).send(questionnaire);
    }

    async allAnsweredQuestionnaireForPacient(req, res) {

        const user = await User.findByPk(whois(req), { include: [Doctor] });
        
        const questionnaire = await Questionnaire.findAll({
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
                        where:{
                            doc_id: user?.doctor?.doc_id
                        },
                        include: {
                            model: Pacient,
                            attributes: [],
                            required: true,
                            where: {
                                pac_id: req.params.pac_id
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).send(questionnaire);
    }
}

module.exports = new QuestionnaireController();