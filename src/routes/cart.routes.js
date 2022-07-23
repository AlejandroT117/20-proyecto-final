const cartClr = require("../controllers/cart.controller");
const router = require("express").Router();

router
  .get("/load", cartClr.loadData)
  .post("/", cartClr.save)
  .get("/all", cartClr.get)
  .get("/:id/user", cartClr.getByUserId)
  .get("/:id", cartClr.getById)
  .delete("/all", cartClr.deleteAll)
  .delete("/:id", cartClr.deleteById)
  .get("/:id/productos", cartClr.getProductsByIdCart)
  .post("/:id/productos", cartClr.saveProdByIdCart)
  .delete("/:id/productos/:id_prod", cartClr.deleteProductById);

module.exports = router;
