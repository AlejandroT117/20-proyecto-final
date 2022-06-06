const express = require("express");
const { Router } = express;
const router = Router();
const auth = require("../middlewares/auth");

const ModelFactory = require('../models/model.factory')

const prodModel = ModelFactory.getModel('productos');
const cartModel = ModelFactory.getModel('cart');
const pedidoModel = ModelFactory.getModel('pedido');
const mailSender = require("../notifications/mail");

const logger = require("../log");

//Router index
router.get("/", (req, res) => {
  const user = req.user;
  res.render("index", { user });
});

router.get("/productos", auth, async (req, res) => {
  const { oBy, s } = req.query;
  const user = req.user;
  const allProducts = await prodModel.getAll(oBy, s);
  const cartById = await cartModel.getByUserId(user.id);

  res.render("productos", { productos: allProducts, user, cartById });
});

router.get("/cart", auth, async (req, res) => {
  const user = req.user;
  const cartById = await cartModel.getByUserId(user.id);
  const total = cartById.productos.reduce((total, curr) => total + curr.precio, 0);

  res.render("cart", { user, cartById, total: total });
});

router.get("/pedido", auth, async(req,res)=>{
  const user = req.user;
  const cartById = await cartModel.getByUserId(user.id);
  const total = cartById.productos.reduce((total, curr) => total + curr.precio, 0);
  let sent = false

  const productos = cartById.productos.map(el => el.nombre)

  try{
    await pedidoModel.save({
      userId: user.id,
      total: total
    })
    await cartModel.deleteByUserId(user.id)

    await mailSender.send(productos, user.email)
    sent = true
  }catch(e){
    logger.error(`Algo salió mal en el pedido: ${e}`)
  }
  res.render('pedido', { user, total: total, sent: sent })
})

module.exports = router;
