const welcome =  (nome) => {
    return( `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .email-container {
                max-width: 600px;
                margin: auto;
            }
            .welcome {
                color: #0D99FF;
                font-size: 1.2em;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <h1>Bem-vindo à Fonoterapi!</h1>
            <p>Olá ${nome}, sua conta  foi criada com Sucesso</p>
            <p>Sua conta foi criada com sucesso. Estamos felizes em tê-lo(a) conosco.</p>
            <p>Aproveite ao máximo nossa plataforma dedicada à fonoterapia.</p>
            <p class="welcome">Bem-vindo! 🥳🎉</p>
            <p>Atenciosamente,</p>
            <p>Equipe Fonoterapi</p>
        </div>
    </body>
    </html>
    `)
}
module.exports = welcome;
