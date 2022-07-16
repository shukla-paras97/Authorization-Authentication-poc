const express = require("express");
const router = express.Router();
const userController= require("../controller/user.controller");
const verifyToken = require('../middlewares/auth')

router.post('/register',userController.registerUser);
router.post('/login',userController.loginUser);
router.get("/logout",verifyToken,userController.logout);

module.exports=router;