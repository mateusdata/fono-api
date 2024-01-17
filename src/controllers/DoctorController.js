const Doctor = require("../models/Doctor");
const { z } = require("zod");
class DoctorController {

    async create(req, res) {
        const createSchema = z.object({
            gov_license: z.number().int().positive(),
        });

        try {
            const { gov_license } = createSchema.parse(req.body);
            return res.status(200).send(await Doctor.create({ gov_license }));
        } catch (erro) {

          return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {
        const { doc_id } = req.body;

        try {
            const doctor = await Doctor.findByPk(doc_id);

            if (doctor) {
                return res.send(doctor)
            }

            return res.status(404).send({ mensage: "Doctor not found" })
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }

    async update(req, res) {
        const updateSchema = z.object({
            gov_license: z.string(),
        });

        try {
            const { gov_license } = updateSchema.parse(req.body);

            const doctor = await Doctor.findByPk(doc_id)?.update({ gov_license });

            if (doctor) {
                return res.send(doctor)
            }

            return res.status(400).send({ mensage: "Doctor not found" })
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

}

module.exports = new DoctorController();
