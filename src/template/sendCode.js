const sendCode = (code) => {
    return (
        `
        <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recuperação de Conta - Fonoterapi</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: auto;
                    }
                    .code {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #FFF;
                        background-color: #0D99FF;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h1>Olá,</h1>
                    <p>Recebemos uma solicitação para redefinir sua senha no aplicativo Fonoterapi.</p>
                    <p>Você recebeu um código de recuperação de senha em seu e-mail. O código é:</p>
                    <p class="code">${code}</p>
                    <p>Se você não solicitou uma redefinição de senha, ignore este e-mail ou entre em contato com o suporte se tiver alguma dúvida.</p>
                    <p>Atenciosamente,</p>
                    <p>Equipe Fonoterapi</p>
                </div>
            </body>
            </html>
        `
    )
}
module.exports = sendCode;