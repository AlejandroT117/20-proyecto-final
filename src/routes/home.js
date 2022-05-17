const express = require("express");
const { Router } = express;
const router = Router();
const auth = require("../middlewares/auth");

const prodModel = require("../models/products");
const cartModel = require("../models/carts");

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
module.exports = router;
