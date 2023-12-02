const { Router } = require("express");

const router = Router();

const middleareUser = require("../middleware/login");

router.get("/talogado",middleareUser , ()=>{
});
module.exports = router;

