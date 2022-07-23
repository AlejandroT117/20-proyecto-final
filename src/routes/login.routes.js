const express = require("express");
const { Router } = express;
const router = Router();

const auth = require("../middlewares/auth");

const loginController = require("../controllers/login.controller");

//Router index
router
  .get("/login", loginController.login)
  .get("/register", loginController.register)
  //passport
  .post("/login", loginController.authLogin)
  .post("/register", loginController.authRegister)
  //jwt
  .get("/auth/jwt", loginController.authJwt)
  .get("/logout", auth, loginController.logout);

module.exports = router;
