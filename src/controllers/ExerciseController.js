const Exercise = require("../models/Exercise");
const { z, ZodError } = require('zod');
const Muscle = require("../models/Muscle");
const MuscleHasExercise = require("../models/MuscleHasExercise");

class ExerciseController {

    async create(req, res) {
        const createSchema = z.object({
            name: z.string().max(150),
            status: z.string().max(150),
            description: z.string().max(250),
            video_urls: z.array(z.string().url().max(150)),
            academic_sources: z.array(z.string().max(150))
        })


        try {
            const { name, status, description, video_urls, academic_sources } = createSchema.parse(req.body);
            const exercise = await Exercise.create({ name, status, description, video_urls, academic_sources });

            if (exercise) {
                return res.status(200).send(exercise);
            }

        } catch (error) {

            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async update(req, res) {
        const updateSchema = z.object({
            id: z.string(),
            name: z.string().max(150).optional(),
            status: z.string().max(150).optional(),
            description: z.string().max(250).optional(),
            video_urls: z.array(z.string().url().max(150)).optional(),
            academic_sources: z.array(z.string().max(150)).optional()
        })

        try {
            const { name, status, description, video_urls, academic_sources } = updateSchema.parse({ ...req.body, ...req.params });
            const exercise = await Exercise.findByPk(req.params.id)?.then((value) => value?.update({ name, status, description, video_urls, academic_sources }));

            if (exercise) {
                return res.status(200).send(exercise);
            }

            return res.status(400).send({ mensage: "Exercise not found" });
        } catch (error) {

          return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {

            const exercise = await Exercise.findByPk(req.params.id);

            if (exercise) {
                return res.status(200).send(exercise);
            }

            return res.status(400).send({ mensage: "Exercise not found" });
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

            if(link){
                return res.status(200).send({message: "Exercise attributed successfuly"});
            }

            return res.status(200).send({message: "Could not attibute exercise to muscle"});
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }
}

module.exports = new ExerciseController();
