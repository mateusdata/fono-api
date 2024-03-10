const { Router } = require('express');
const router = Router();

const UserController = require('../controllers/UserController');
const PersonController = require('../controllers/PersonController');
const DoctorController = require('../controllers/DoctorController');

const middlewareUser = require('../middleware/login');
const AuthController = require('../controllers/AuthController');
const PasswordResetController = require('../controllers/PasswordResetController');
const ExerciseController = require('../controllers/ExerciseController');
const MuscleController = require('../controllers/MuscleController');
const ExercisePlanController = require('../controllers/ExercisePlanController');
const ProtocolController = require('../controllers/ProtocolController');
const PacientController = require('../controllers/PacientController');
const SessionController = require('../controllers/SessionController');
const QuestionnaireController = require('../controllers/QuestionnaireController');
const PlanController = require('../controllers/PlanController');
const middlewarePayment = require('../middleware/payment');

router.post('/login', AuthController.login);
router.post('/send-reset-code', PasswordResetController.sendResetCode);
router.post('/verify-reset-code', PasswordResetController.verifyResetCode);
router.post('/reset-password', PasswordResetController.resetPassword);
router.post('/create-user', UserController.createUser);

//router.use(middlewareUser);

//router.use(middlewarePayment);

router.get('/info-user/:id', UserController.info);
router.post('/update-user/:id', UserController.update);

router.post('/create-person', PersonController.create);
router.get('/info-person/:id', PersonController.info);
router.post('/link-person-to-user', PersonController.linkPersonToUser);

router.post('/create-doctor', DoctorController.create);
router.get('/info-doctor/:id', DoctorController.info);
router.post('/update-doctor/:id', DoctorController.update);
router.get('/search-pacients/:id', DoctorController.searchMyPacients);
router.get('/count-pacients/:id', DoctorController.countMyPacients);

router.post('/create-exercise', ExerciseController.create);
router.get('/info-exercise/:id', ExerciseController.info);
router.post('/update-exercise/:id', ExerciseController.update);
router.post('/link-exercise-to-muscle', ExerciseController.linkExerciseToMuscle);
router.post('/search-exercise', ExerciseController.search)

router.post('/create-muscle', MuscleController.create);
router.get('/info-muscle/:id', MuscleController.info);
router.post('/update-muscle/:id', MuscleController.update);

router.post('/create-exercise-plan', ExercisePlanController.create);
router.get('/info-exercise-plan/:id', ExercisePlanController.info);
router.post('/update-exercise-plan/:id', ExercisePlanController.update);


router.post('/create-pacient', PacientController.create);
router.get('/info-pacient/:id', PacientController.info);
router.post('/update-pacient/:id', PacientController.update);
router.post('/protocol-to-pacient', PacientController.attachProtocol);
router.post('/search-pacient', PacientController.search);

router.post('/create-session', SessionController.create);
router.post('/update-session/:id', SessionController.update);
router.get('/end-session/:id', SessionController.end);
router.get('/info-session/:id', SessionController.info);
router.get('/last-sessions', SessionController.lastSessions);

router.post('/create-protocol', ProtocolController.create);
router.get('/info-protocol/:id', ProtocolController.info);
router.post('/update-protocol/:id', ProtocolController.update);

router.post('/create-questionnaire', QuestionnaireController.create)
router.get('/info-questionnaire/:id', QuestionnaireController.info);
router.post('/update-questionnaire/:id', QuestionnaireController.update);
router.post('/answer-questionnaire', QuestionnaireController.answerQuestionnaire);
router.get('/answered-questionnaire/:qus_id/:pac_id', QuestionnaireController.answeredQuestionnaire)
router.get('/answered-questionnaire/:pac_id', QuestionnaireController.allAnsweredQuestionnaireForPacient)
router.get('/next-questionnaire/:id', QuestionnaireController.nextQuestionnaire);

router.post('/create-plan', PlanController.create);
router.get('/info-plan/:id', PlanController.info);
router.post('/update-plan/:id', PlanController.update);
router.get('/available-plans', PlanController.availablePlans);
router.get('/set-user-plan/:use_id/:pla_id', PlanController.setUserPlan);

router.get('/islogged', middlewareUser, AuthController.isLogged);

module.exports = router;
