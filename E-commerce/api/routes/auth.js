const express = require("express");
const router = express.Router();
const { registerCtrl, loginCtrl, logOut, logError } = require("../controllers/auth");
const { validateRegister, validateLogin, isAuthenticated } = require("../validators/auth");
const {loginGoogle, loginCallBackGoogle} = require('../controllers/google-auth');


router.post("/register", validateRegister, registerCtrl);
router.post("/login", validateLogin, loginCtrl);

// auth google
router.get("/login/google", loginGoogle);
router.get("/login/google/callback", loginCallBackGoogle);


//recuperar datos del usuario
router.get('/data',isAuthenticated,(req,res)=>{
     res.json(req.user)
});

//logout 
router.get("/logout", logOut);
router.get("/login/error", logError );

module.exports = router;