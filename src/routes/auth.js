const { Router } = require('express');
const router = Router();

const UserController = require('../controllers/UserController');
const PersonController = require('../controllers/PersonController');
const DoctorController = require('../controllers/DoctorController');

const middlewareUser = require('../middleware/login');
const AuthController = require('../controllers/AuthController');
const PasswordResetController = require('../controllers/PasswordResetController');
const ExerciseController = require('../controllers/ExerciseController');


router.post('/create-user', UserController.createUser);
router.get('/info-user/:id', UserController.info);
router.post('/update-user/:id', UserController.update);

router.post('/create-person', PersonController.create);
router.get('/info-person/:id', PersonController.info);
router.post('/link-person-to-user', PersonController.linkPersonToUser);

router.post('/create-doctor', DoctorController.create);
router.get('/info-doctor', DoctorController.info);
router.post('/update-doctor/:id', DoctorController.update);

router.post('/create-exercise', ExerciseController.create);
router.get('/info-exercise/:id', ExerciseController.info);
router.post('/update-exercise/:id', ExerciseController.update);

router.post('/login', AuthController.login);
router.post('/send-reset-code', PasswordResetController.sendResetCode);
router.post('/verify-reset-code', PasswordResetController.verifyResetCode);
router.post('/reset-password', PasswordResetController.resetPassword);

router.get('/islogged', middlewareUser, AuthController.isLogged);

module.exports = router;
