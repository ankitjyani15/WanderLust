const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router
.route("/signup")
.get(userController.signupForm)
.post( wrapAsync(userController.signupRoute));

router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login' ,failureFlash :true }) ,userController.loginRoute);

router.get("/logout",userController.logout)

module.exports = router;