const { Router } = require("express");
const router = Router();

const RegisterController  = require("../controllers/UserController");
const middlewareUser = require("../middleware/login");
const AuthController = require("../controllers/AuthController");
const PasswordResetController = require("../controllers/PasswordResetController");

router.post("/create-user", RegisterController.createUser); 
router.post("/create-person", RegisterController.createPerson);
router.post("/login", AuthController.login);
router.post("/send-reset-code", PasswordResetController.sendResetCode);
router.post("/verify-reset-code", PasswordResetController.verifyResetCode);
router.post("/reset-password", PasswordResetController.resetPassword);

router.get("/islogged",middlewareUser , AuthController.isLogged);

module.exports = router;
