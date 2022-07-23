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
    res.cookie("user", req.user.email);

    res.redirect("/");
  },
  logout: (req, res) => {
    logger.log(`${req.user.email} ending session...`);
    res.clearCookie("user");
    req.logOut();
    res.redirect("/");
  },
};
