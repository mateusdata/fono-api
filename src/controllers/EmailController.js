const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require('dotenv').config();
const sgMail = require("@sendgrid/mail");
const welcome = require("../template/welcome.js")
const sendCode = require("../template/sendCode.js")

class EmailController {

  async welcome(email, nome) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    if (email && nome) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: { email: 'engsextosemestre@gmail.com', name: 'Fonotherapp' },
        subject: "Parabens, sua conta foi criada",
        text: "Fonotherapp",
        html: `${welcome(nome)}`
      };
      sgMail
        .send(msg)
        .then(() => {
        })
        .catch((error) => {
          console.error("Erro ao enviar email ", error);
        });
    }
  }

  async sendResetCode(email,code){

    if (email) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: { email: 'engsextosemestre@gmail.com', name: 'Fonotherapp' },
        subject: "Código de Recuperação",
        text: "Fonotherapp",
        html: `${sendCode(code)}`
      };
      sgMail
        .send(msg)
        .then(() => {
        })
        .catch((error) => {
          console.error("Erro ao enviar email ", error);
        });
    }

  }
}

module.exports = new EmailController();
