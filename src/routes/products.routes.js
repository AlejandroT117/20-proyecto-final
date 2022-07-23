const productoClr = require("../controllers/products.controller");
const router = require("express").Router();

router
  .get("/load", productoClr.loadData)
  .get("/all", productoClr.get)
  .get("/:id", productoClr.getById)
  .post("/", productoClr.save)
  .put("/:id", productoClr.editById)
  .delete("/all", productoClr.deleteAll)
  .delete("/:id", productoClr.deleteById);

module.exports = router;
