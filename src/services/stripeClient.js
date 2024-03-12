const Person = require('../models/Person');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const stripeClient = require('stripe')(process.env.stripeKey);

class CustomStipe {

    constructor(){
        this.rawClient = stripeClient;
    }

    async createCostumer (user_id) {
        const user = await User.findByPk(user_id, {
            include: Person,
        });

        try{
            const customer = await stripeClient.customers.create({
                name: user.nick_name,
                email: user.email,
                invoice_prefix: Number.parseInt(Math.random()*1000),
            });
            return customer;
        }catch(error){
            console.log(error);
            return null;
        }       
    }

    getRaw() {
        console.log(this.rawClient);
        return this.rawClient;
    }
}



module.exports = new CustomStipe();