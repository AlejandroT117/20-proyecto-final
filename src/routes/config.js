const express = require("express");
const { Router } = express;
const router = Router();
const path = require('path')
const multer = require('multer')
const auth = require("../middlewares/auth");
const logger = require('../log')

const ModelFactory = require('../models/model.factory')
const cartModel = ModelFactory.getModel('cart');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/img/users/'))
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '.png')
  }
})
const upload = multer({ storage })

router.get("/", auth, async (req,res)=>{
  const user = req.user
  const cartById = await cartModel.getByUserId(user.id);

  res.render('config', {user, cartById})
})

router.post("/", upload.single("img"), (req, res)=>{
  if(req.file){
    logger.log(`Imagen guardada: ${req.user.id}`)
  }

  res.redirect('/config')
})

module.exports = router;