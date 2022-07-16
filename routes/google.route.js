const express = require("express");
const router = express.Router();
const googleController= require("../controller/oauth.controller");
const checkToken = require('../middlewares/checkOauth')

router.post('/googlelogin',googleController.googleLogin);
router.get("/googledata",checkToken,googleController.getProfile);


module.exports=router;