const { Router } = require('express');

const router = Router();

const AuthController = require('../controllers/AuthController');
const PasswordResetController = require('../controllers/PasswordResetController');
const UserController = require('../controllers/UserController');
const PaymentGatewayController = require('../controllers/PaymentGatewayController');
const middlewareUser = require('../middleware/login');

router.post('/login', AuthController.login);
router.post('/send-reset-code', PasswordResetController.sendResetCode);
router.post('/verify-reset-code', PasswordResetController.verifyResetCode);
router.post('/reset-password', PasswordResetController.resetPassword);
router.post('/create-user', UserController.createUser);

router.post('/webhook', PaymentGatewayController.webhook);
router.get('/list-plans', PaymentGatewayController.listPlans);


// Fetch the Checkout Session to display the JSON result on the success page
router.get("/checkout-session", PaymentGatewayController.retrieveCheckout);

router.post("/create-checkout-session", PaymentGatewayController.createSession);

router.get("/config", (req, res) => {
    res.send({
        publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

router.get('/islogged', middlewareUser, AuthController.isLogged);

//router.post('/customer-portal', PaymentGatewayController.costumerPortal);

module.exports = router;

