const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Plan = require("../models/Plan");

//TODO add user to invoice if detected it has made its payments
//TODO block some routes if it has not made the payments
const middlewarePayment = (req, res, next) => {
    const tokenHeader = req.header("Authorization");

    if (!tokenHeader) {
        return res.status(403).send("Access Unauthorized");
    }

    const token = tokenHeader.split(" ")[1];

    try {

        jwt.verify(token, process.env.secretKey, async (err, decode) => {

            if (err) {
                return res.status(401).json({ message: "Token is invalid or expired" });
            }

            req.id_token = decode.id_token;

            const user = await User.findByPk(decode.id_token);

            if (!user) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            if(user.subscription_status){
                
            }
            next();

        });

    } catch {

        return res.status(402).json({ message: "Payment needed" });
    }
};

module.exports = middlewarePayment;