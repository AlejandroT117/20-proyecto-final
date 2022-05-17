const express = require('express')
const {Router} = express
const router = Router()

const passport = require('passport')
const {generateToken} = require('../services/jwt')
const auth = require("../middlewares/auth")

const logger = require('../log')


//Router index
router.get("/login", (req, res)=>{  
  res.render('login')
})

router.get("/register", (req, res)=>{
  res.render('register')
})

//passport
router.post('/login', passport.authenticate('login', {
  successRedirect: '/auth/jwt',
  failureRedirect: '/login',
  failureFlash:true
}))
router.post('/register', passport.authenticate('register', {
  successRedirect: '/auth/jwt',
  failureRedirect: '/register',
  failureFlash:true
}))

//jwt
router.get('/auth/jwt', (req,res)=>{
  const token = generateToken(req.user)
  logger.log(`Nuevo token creado ${token}`)
  res.clearCookie('token');
  res.cookie('token', token);
  res.cookie('user', req.user.email)

  res.redirect('/')
})

router.get("/logout", auth, (req, res) => {
  logger.log(`${req.user.email} ending session...`)
  res.clearCookie("user");
  req.logOut();
  res.redirect('/')
});

module.exports = router