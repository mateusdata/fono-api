const Person = require("../models/Person");
const UserHasPerson = require("../models/PersonHasUser");

class PersonController {

    async create(req, res) {
        const { first_name, middle_name, last_name, cpf, birthday } = req.body;
        console.log('hello');

        try {
            res.status(200).send(await Person.create({ first_name, middle_name, last_name, cpf, birthday }));
        } catch (erro) {
            res.status(500).send({ mensage: "Error on server" });
        }
    }

    async linkPersonToUser(req, res) {
        const { use_id, per_id } = req.body

        try {
            res.status(200).send(await UserHasPerson.create({ use_id, per_id }));
        } catch (erro) {
            console.log(erro);
            res.status(500).send({ mensage: "Error on server" });
        }

    }

    async info(req, res) {
        const { per_id } = req.body;

        try {
            const person = await Person.findByPk(per_id);

            if (person) {
                return res.send(person)
            }
            return res.status(400).send({ mensage: "Person not found" })
        } catch (error) {
            res.status(500).send({ mensage: "Server error" });
        }

    }

}

module.exports = new PersonController();
