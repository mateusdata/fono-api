const stripe = require("../services/stripeClient");
const User = require('../models/User');
const Person = require('../models/Person');
const Costumer = require("../models/Costumer");

class PaymentGatewayController {

    
    async retrieveCheckout(req, res){

        return res.send({message: 'teu cu'});
    }
    
    
    async createSession(req, res) {
       
        const {email, priceId} = req.body;

        const checkoutSession  = await stripe.createSession(email, priceId, '', '');

       
        if(!checkoutSession){
            res.status(500).send({ message: "Deu erro essa peste"});
        }
       

        return res.status(200).send({ client_secret: checkoutSession?.client_secret});
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