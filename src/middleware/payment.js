const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Costumer = require("../models/Costumer");
const Subscription = require("../models/Subscription");

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

            const user = await User.findByPk(decode.id_token,{include:{
                model: Costumer,
                include:{
                    model: Subscription,
                    require: true
                },
                require: true
            }});

            if (!user) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            if(user?.costumer?.subscription?.subscription_status != 'active' && user?.costumer?.subscription?.subscription_status != 'trialing'){
                return res.status(403).json({ message: "Unauthorized" });
            }
            
            next();

        });

    } catch {

        return res.status(402).json({ message: "Payment needed" });
    }
};

module.exports = middlewarePayment;