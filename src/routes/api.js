const { Router } = require('express');

const router = Router();

const middleareUser = require('../middleware/login');
//router.use(middleareUser);
router.get('/talogado', ()=>{send('vc tem token parabens!')});


module.exports = router;

