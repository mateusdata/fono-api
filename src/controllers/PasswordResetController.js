const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const EmailController = require("./EmailController");
require('dotenv').config();
class PasswordResetController {

    async sendResetCode(req, res) {
        const { email } = req.body;
        try {
            const user = await User.findOne({ where: { email }, attributes: ['email', 'user_id'] });
            if (user) {
                const code = Math.floor(Math.random() * 999999);
                let expiration = new Date(new Date().getTime() + 30 * 60000);
                const updateUser = await User.update({ verification_code: code, expiration_date: expiration }, { where: { user_id: user.user_id } })
                if (updateUser) {
                    EmailController.sendResetCode(email, code);
                    return res.send(user)
                }
                return res.status(400).send({ mensage: "Ocorreu um erro ao enviar  atualizar" })
            }
            res.status(400).send({ mensage: "Usuario inexistente" });
        } catch (erro) {
            res.status(500).send({ mensage: "Erro no" });
        }
    }

    async verifyResetCode(req, res) {
        const { email,verification_code } = req.body;
        try {
            const user = await User.findOne({ where: { email, verification_code }, attributes: ['email', 'user_id', "verification_code", "expiration_date"] });
            console.log(verification_code == user.verification_code);
            if (user) {
                return res.send(user)
            }
            return res.status(400).send({ mensage: "Código invalido " })
        } catch (error) {
            res.status(500).send({ mensage: "Código invalido" });
        }

    }

    async resetPassword(req, res) {
        const { email, newPassword } = req.body;
        try {
            const user = await User.findOne({ where: { email }, attributes: ['email', 'user_id'] });
            if (user) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword, salt);
                const updateUser = await User.update({ password: hash }, { where: { user_id: user.user_id } });
                if (updateUser) {
                    return res.send({ message: "Senha atualizada com sucesso!" });
                }
                return res.status(400).send({ message: "Ocorreu um erro ao atualizar a senha" });
            }
            return res.status(400).send({ message: "Usuário inexistente" });
        } catch (error) {
            res.status(500).send({ message: "Erro no servidor" });
        }
    }
    
}

module.exports = new PasswordResetController();
