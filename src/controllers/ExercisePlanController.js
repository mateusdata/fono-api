const ExercisePlan = require("../models/ExercisePlan");
const { z, ZodError } = require('zod');

class ExercisePlanController {
    
    async create(req, res){
        const createSchema = z.object({
            exe_id: z.number().int().optional(),
            repetitions: z.number().int().positive(),
            series: z.number().int().positive(),
        });

        try{
            const exercise_plan = await ExercisePlan.create(createSchema.parse(req.body));
            if(exercise_plan){
                return res.status(200).send(exercise_plan);
            }

            return res.status(403).send({message:"Exercise plan could not be created"});
        } catch(error){
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async update(req, res){
        const updateSchema = z.object({
            exe_id: z.number().int().optional(),
            repetitions: z.number().int().positive().optional(),
            series: z.number().int().positive().optional(),
        });

        try{
            const exercise_plan = await ExercisePlan.findByPk(req.params.id).then((value) => value?.update(updateSchema.parse(req.body)));
            if(exercise_plan){
                return res.status(200).send(exercise_plan);
            }

            return res.status(403).send({message:"Exercise plan could not be update"});
        } catch(error){
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res){
        
        try{
            const exercise_plan = await ExercisePlan.findByPk(req.params.id);
            console.log(exercise_plan);
            if(exercise_plan){
                return res.status(200).send(exercise_plan);
            }

            return res.status(403).send({message:"Exercise plan could not be found"});
        } catch(error){
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }
}

module.exports = new ExercisePlanController();