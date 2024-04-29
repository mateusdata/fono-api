const jwt = require("jsonwebtoken");

function whois(req) { 
    const tokenHeader = req.header("Authorization");
    let user_id;
    if (!tokenHeader) {
        return null;
    }

    const token = tokenHeader.split(" ")[1];

    try {

        jwt.verify(token, process.env.secretKey, async (err, decode) => {
            
            if (err) {
                return null;
            }
            
            user_id = decode.id_token;
        });

        return user_id;
    } catch {

        return null;
    }
}

module.exports = whois;
