const passport = require("passport");
const { generateToken } = require("../services/jwt");

const logger = require("../log");

module.exports = {
  login: (req, res) => {
    res.render("login");
  },
  register: (req, res) => {
    res.render("register");
  },
  authLogin: passport.authenticate("login", {
    successRedirect: "/auth/jwt",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  authRegister: passport.authenticate("register", {
    successRedirect: "/auth/jwt",
    failureRedirect: "/register",
    failureFlash: true,
  }),
  authJwt: (req, res) => {
    const token = generateToken(req.user);
    logger.log(`Nuevo token creado ${token}`);
    res.clearCookie("token");
    res.cookie("token", token);
    res.cookie("email", req.user.email);
    res.cookie('firstname', req.user.firstname);
    res.cookie('lastname', req.user.lastname);
    res.cookie('id', req.user.id);

    res.redirect("/");
  },
  logout: (req, res) => {
    logger.log(`${req.user.email} ending session...`);
    res.clearCookie("user");
    res.clearCookie("firstname");
    res.clearCookie("lastname");
    res.clearCookie("id");
    req.logOut();
    res.redirect("/");
  },
};
