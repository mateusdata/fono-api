const Doctor = require('../models/Doctor');
const DoctorHasPacient = require('../models/DoctorHasPacient');
const Pacient = require('../models/Pacient');
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
            console.log(error);
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

        const pacients = await Doctor.findByPk(id, { include: Pacient });
        // const pacients = await DoctorHasPacient.count();

        return res.status(200).send({ me: pacients });
    }

}

module.exports = new DoctorController();
