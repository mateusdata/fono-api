const Doctor = require('../models/Doctor');
const Pacient = require('../models/Pacient');
const Person = require('../models/Person');
const User = require('../models/User');
const { z, ZodError } = require('zod');

class DoctorController {

    async create(req, res) {
        const createSchema = z.object({
            use_id: z.number().int().positive(),
            gov_license: z.number().int().positive().optional(),
        });

        try {


            const doctor = await Doctor.create(createSchema.parse());

            if (doctor) {
                return res.status(200).send(doctor);
            }
            return res.status(409).send({ message: 'Doctor could not be created' });
        } catch (error) {
            
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {
            const doctor = await Doctor.findByPk(req.params.id, {
                attributes: {
                    exclude: 'password',
                },
                include: {
                    model: User,

                }
            });

            if (doctor) {
                return res.status(200).send(doctor);
            }

            return res.status(404).send({ mensage: 'Doctor not found' })
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }

    async update(req, res) {
        const updateSchema = z.object({
            gov_license: z.string().optional(),
        });

        try {

            const doctor = await Doctor.findByPk(doc_id)?.update(updateSchema.parse(req.body));

            if (doctor) {
                return res.send(doctor)
            }

            return res.status(400).send({ mensage: 'Doctor not found' })
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async searchMyPacients(req, res) {
        const { id } = req.params;

        const pacients = await Doctor.findByPk(id, {
            attributes: { exclude: ['created_at', 'updated_at'] },
            include: {
                model: Pacient,
                attributes: { exclude: ['created_at', 'updated_at'] },
                through: {
                    attributes: []
                },
                include: { 
                    model: Person,
                    attributes: { exclude: ['created_at', 'updated_at'] },
                  
                }
            }
        });

        return res.status(200).send(pacients);
    }

    async countMyPacients(req, res) {
        const { id } = req.params;

        const n_pacients = await Doctor.count({
            where:{
                doc_id: id
            },
            attributes: { exclude: ['created_at', 'updated_at'] },
            include: {
                required: true,
                model: Pacient,
                attributes: { exclude: ['created_at', 'updated_at'] },
                through: {
                    attributes: []
                },
                include: { 
                    model: Person,
                    attributes: { exclude: ['created_at', 'updated_at'] },
                  
                }
            }
        });

        return res.status(200).send({doc_id: id, num_pacients: n_pacients});
    }
}

module.exports = new DoctorController();
