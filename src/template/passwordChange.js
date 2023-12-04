const passwordChanged = () => {
    return (
        `   
    <!DOCTYPE html>
    <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Senha Alterada - Fonoterapi</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .email-container {
                    max-width: 600px;
                    margin: auto;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1>Olá,</h1>
                <p>Sua senha no aplicativo Fonoterapi foi alterada com sucesso.</p>
                <p>Se você não fez essa alteração, entre em contato com o suporte imediatamente.</p>
                <p>Atenciosamente,</p>
                <p>Equipe Fonoterapi</p>
            </div>
        </body>
    </html>
`
    )
}
module.exports = passwordChanged