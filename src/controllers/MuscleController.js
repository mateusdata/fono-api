const Muscle = require('../models/Muscle');
const Exercise= require('../models/Exercise');
const { z, ZodError } = require('zod');

class MuscleController {

    async create(req, res) {
        const createSchema = z.object({
            name: z.string().max(150),
            exe_id: z.number().int().positive().optional(),
            latin_name: z.string().max(150),
            image_urls: z.array(z.string().url().max(150)).optional()
        })

        try {
            const muscle = await Muscle.create(createSchema.parse(req.body));
            
            if(req.body.exe_id){
                await muscle.addExercise(await Exercise.findByPk(req.body.exe_id));
            }
            

            if (muscle) {
                return res.status(200).send(muscle);
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async update(req, res) {
        const updateSchema = z.object({
            name: z.string().max(150).optional(),
            latin_name: z.string().max(150).optional(),
            image_urls: z.array(z.string().url().max(150)).optional()
        })

        try {

            const muscle = await Muscle.findByPk(req.params.id)?.then((value) => value?.update(updateSchema.parse(req.body)));

            if (muscle) {
                return res.status(200).send(muscle);
            }

            return res.status(404).send({ mensage: "Muscle not found" });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {

            const muscle = await Muscle.findByPk(req.params.id);

            if (muscle) {
                return res.status(200).send({muscle, exercises: await muscle.getExercises()});
            }

            return res.status(400).send({ mensage: "Muscle not found" });
        } catch (error) {

            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }

}

module.exports = new MuscleController();
