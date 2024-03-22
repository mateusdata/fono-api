const stripe = require("../services/stripeClient");
const User = require('../models/User');
const Person = require('../models/Person');
const Costumer = require("../models/Costumer");

class PaymentGatewayController {

    async createCostumer(req, res) {
        const user = await User.findByPk(req.params.id, {
            include: Person,
            required: true
        });

        const customer = await stripe.customers.create({
            name: user.nick_name,
            email: user.email,
        });
    }

    async subscribe(req, res) {
        const { price_id } = req.body;

        const user = await User.findByPk(req.params.id, {
            include: {
                include: Costumer,
                required: true
            }
        });

        if (!user) {
            return res.status(404).send({ message: 'User doesn\'t exists' });
        }

        const subscription = await stripe.getRaw().subscriptions.create({
            customer: user.costumer_id,
            items: [
                {
                    price: price_id,
                },
            ],
            trial_end: 1610403705,
        });

        return res.status(404).send({ message: 'Subscription could not be created' })
    }

    async listPlans(req, res) {
        const plans = await stripe.getPrices();

        res.status(200).send(plans);
    }

    async webhook(req, res) {

        const sig = request.headers['stripe-signature'];

        let event;
        try {
            event = stripe.getRaw().webhooks.constructEvent(request.body, sig, endpointSecret);
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        console.log(event);
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;

                // Then define and call a function to handle the event payment_intent.succeeded
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        response.status(200).send();

    }
}

module.exports = new PaymentGatewayController();