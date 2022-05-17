const express = require('express')
const {Router} = express
const router = Router()

const prodModel = require("../models/products");


//Router index
router.get("/", (req, res)=>{
  const user = req.user
  res.render('index', {user})
})

router.get("/productos", async (req,res)=>{
  const { oBy, s} = req.query;
  const allProducts = await prodModel.getAll(oBy, s);
  
  res.render("productos", {productos: allProducts})
})


module.exports = router