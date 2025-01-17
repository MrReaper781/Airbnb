const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { emailid, username, password } = req.body;
      const newUser = new User({ emailid, username });
      let registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", "User Already Exist");
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/listings");
  }
);

module.exports = router;
