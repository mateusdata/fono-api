const { z, ZodError } = require('zod');
const Question = require('../models/Question');
const Questionnaire = require('../models/Questionnaire');
const QuestionAnswered = require('../models/QuestionAnswered');

class QuestionnaireController {
    async create(req, res) {
        const createSchema = z.object({
            name: z.string().max(150),
            purpose: z.string().max(150),
            questions: z.object({
                name: z.string().max(150),
                alternatives: z.array(z.string().max(150)),
            }).array().optional(),
        });

        try {
            const questionnaire = await Questionnaire.create(
                createSchema.parse(req.body),
                {
                    include: Questionnaire.Question
                }
            );

            if (questionnaire) {
                return res.status(200).send(questionnaire);
            }

            return res.status(400).send('Questionnaire could not be created');
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {
            const questionnaire = await Questionnaire.findByPk(req.params.id, {
                include: {
                    model: Question,
                    attributes: { exclude: ['created_at', 'updated_at'] },
                },
                attributes: { exclude: ['created_at', 'updated_at'] }
            });

            if (questionnaire) {

                return res.status(200).send(questionnaire);
            }

            return res.status(404).send({ message: 'Questionnaire not found' });
        } catch (error) {
            console.log(error);
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

    async answerQuestionnaire(req, res){
        const answerSchema = z.object({
            
        });

        try{

        }catch(error){
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }
}

module.exports = new QuestionnaireController();