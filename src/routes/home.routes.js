const express = require("express");
const { Router } = express;
const router = Router();
const auth = require("../middlewares/auth");

const homeController = require("../controllers/home.controller");

//Router index
router
  .get("/", homeController.renderIndex)
  .get("/productos", auth, homeController.showProducts)
  .get("/cart", auth, homeController.showCart)
  .get("/pedido", auth, homeController.showOrder);

module.exports = router;
