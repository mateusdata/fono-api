const Doctor = require("../models/Doctor");

class DoctorController {

    async create(req, res) {
        const { gov_license } = req.body;

        try {
            res.status(200).send(await Doctor.create({ gov_license }));
        } catch (erro) {
            console.log(erro);
            res.status(500).send({ mensage: "Error on server" });
        }
    }

    async info(req, res) {
        const { doc_id } = req.body;

        try {
            const doctor = await Doctor.findByPk(doc_id);

            if (doctor) {
                return res.send(doctor)
            }

            return res.status(400).send({ mensage: "Doctor not found" })
        } catch (error) {
            res.status(500).send({ mensage: "Server error" });
        }

    }

}

module.exports = new DoctorController();
