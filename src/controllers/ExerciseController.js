const Exercise = require('../models/Exercise');
const { z, ZodError } = require('zod');
const MuscleHasExercise = require('../models/MuscleHasExercise');
const Muscle = require('../models/Muscle');
const { Sequelize, Op } = require('sequelize');

class ExerciseController {

    async create(req, res) {
        const createSchema = z.object({
            name: z.string().max(150),
            mus_id: z.number().int().positive().optional(),
            status: z.enum(['active', 'banned', 'inactive']).optional(),
            objective: z.string().max(250),
            description: z.string().max(250),
            video_urls: z.array(z.string().max(150)),
            academic_sources: z.array(z.string().max(150))
        })


        try {
            const exercise = await Exercise.create(createSchema.parse(req.body));

            if (exercise) {
                return res.status(200).send(exercise);
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async update(req, res) {
        const updateSchema = z.object({
            name: z.string().max(150).optional(),
            status: z.enum(['active', 'banned', 'inactive']).optional(),
            description: z.string().max(250).optional(),
            video_urls: z.array(z.string().max(150)).optional(),
            academic_sources: z.array(z.string().max(150)).optional()
        })

        try {
            const { name, status, description, video_urls, academic_sources } = updateSchema.parse({ ...req.body, ...req.params });
            const exercise = await Exercise.findByPk(req.params.id)?.then((value) => value?.update({ name, status, description, video_urls, academic_sources }));

            if (exercise) {
                return res.status(200).send(exercise);
            }

            return res.status(400).send({ mensage: 'Exercise not found' });
        } catch (error) {

            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {

            const exercise = await Exercise.findByPk(req.params.id, {
                include: {
                    model: Muscle,
                }
            });

            if (exercise) {
                return res.status(200).send(exercise);
            }

            return res.status(400).send({ mensage: 'Exercise not found' });
        } catch (error) {

            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }

    async linkExerciseToMuscle(req, res) {
        const linkSchema = z.object({
            mus_id: z.number().int().positive(),
            exe_id: z.number().int().positive()
        });

        try {
            const { mus_id, exe_id } = linkSchema.parse(req.body);
            const link = MuscleHasExercise.create({ mus_id, exe_id });

            if (link) {
                return res.status(200).send({ message: 'Exercise attributed successfuly' });
            }

            return res.status(200).send({ message: 'Could not attibute exercise to muscle' });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }

    async search(req, res) {

        try {

            const exercises = await Exercise.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.match]: Sequelize.fn('to_tsquery', req.body.search.replaceAll(/\s+/g, " | "))
                            }
                        }, {
                            description: {
                                [Op.match]: Sequelize.fn('to_tsquery', req.body.search.replaceAll(/\s+/g, " | "))
                            }
                        }, {
                            objective: {
                                [Op.match]: Sequelize.fn('to_tsquery', req.body.search.replaceAll(/\s+/g, " | "))
                            }
                        }
                    ]

                }

            });

            if (exercises) {
                return res.status(200).send(exercises);
            }

            return res.status(400).send({ mensage: 'Exercise not found' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }
}

module.exports = new ExerciseController();
