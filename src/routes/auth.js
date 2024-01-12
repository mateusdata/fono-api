const { Router } = require("express");
const router = Router();

const RegisterController  = require("../controllers/UserController");
const PersonController = require('../controllers/PersonController');
const DoctorController = require('../controllers/DoctorController');

const middlewareUser = require("../middleware/login");
const AuthController = require("../controllers/AuthController");
const PasswordResetController = require("../controllers/PasswordResetController");
const Person = require("../models/Person");

router.post("/create-user", RegisterController.createUser); 
router.get('/info-user', RegisterController.Info);

router.post('/create-person', PersonController.create);
router.get('/info-person', PersonController.info);
router.post('/link-person-to-user', PersonController.linkPersonToUser);


router.post('/create-doctor', DoctorController.create);
router.get('/info-doctor', DoctorController.info);

router.post("/login", AuthController.login);
router.post("/send-reset-code", PasswordResetController.sendResetCode);
router.post("/verify-reset-code", PasswordResetController.verifyResetCode);
router.post("/reset-password", PasswordResetController.resetPassword);

router.get("/islogged",middlewareUser , AuthController.isLogged);

module.exports = router;
