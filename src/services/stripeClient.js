const { Client } = require('pg');
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
            
            return null;
        }       
    }

    async createCard(use_id, exp_month, exp_year, card_number, cvc) {

        const user = await User.findByPk(use_id,{
            include: [Person, Client],
            require: true
        })

        const customerSource = await stripe.customers.createSource(
            user.client.client_id,
            { 
                exp_month: exp_month,
                exp_year: exp_year,
                number: card_number,
                cvc: cvc,
                object: 'card',
                address_city: person.address.city,
                address_country: person.address.country,
                address_line1: person.address.line1,
                address_line2: person.address.line2,
                address_zip: person.address.zip_code,
                name: person.first_name + person.last_name
            }
        );

        return customerSource;
    }
    
    async getPrices() {
        const prices = await stripeClient.prices.list({
            expand: ['data.product']
        });

        return prices.data;
    }

    getRaw() {
        console.log(this.rawClient);
        return this.rawClient;
    }
}



module.exports = new CustomStipe();