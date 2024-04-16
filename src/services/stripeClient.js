const Person = require('../models/Person');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const stripeClient = require('stripe')(process.env.STRIPE_SECRET_KEY);

class CustomStipe {

    constructor() {
        this.rawClient = stripeClient;
    }

    async createCostumer(user_id) {
        const user = await User.findByPk(user_id, {
            include: Person,
        });

        try {
            const customer = await stripeClient.customers.create({
                name: user.nick_name,
                email: user.email,
                invoice_prefix: Number.parseInt(Math.random() * 1000),
            });
            return customer;
        } catch (error) {

            return null;
        }
    }

    async createToken(user, card_info) {
        const tokenResponse = await stripeClient.createToken(stripeClient.elements.create('payment'), {
            exp_month: card_info.exp_month,
            exp_year: card_info.exp_year,
            number: card_info.card_number,
            cvc: card_info.cvc,
            address_city: user.person.address.city,
            address_country: user.person.address.country,
            address_line1: user.person.address.line1,
            address_line2: user.person.address.line2,
            address_zip: user.person.address.zip_code,
            name: user.person.first_name + user.person.last_name
        });

        return tokenResponse;
    }

    async createCard(user, card_info) {


        const customerSource = await stripeClient.customers.createSource(
            user.costumer.costumer_id,
            {
                source: {
                    exp_month: card_info.exp_month,
                    exp_year: card_info.exp_year,
                    number: card_info.card_number,
                    cvc: card_info.cvc,
                    object: 'card',
                    address_city: user.person.address.city,
                    address_country: user.person.address.country,
                    address_line1: user.person.address.line1,
                    address_line2: user.person.address.line2,
                    address_zip: user.person.address.zip_code,
                    name: user.person.first_name + user.person.last_name
                }
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

    async createSession(email, priceId) {
        const session = await stripeClient.checkout.sessions.create({
            mode: "subscription",
            customer_email: email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            billing_address_collection: "required",
            phone_number_collection: {
                enabled: true,
            },
            locale: "pt",
            // automatic_tax: { enabled: true }
            ui_mode: 'embedded',
            redirect_on_completion: 'never'
        });

        return session;
    }

    getRaw() {
        console.log(this.rawClient);
        return this.rawClient;
    }
}



module.exports = new CustomStipe();