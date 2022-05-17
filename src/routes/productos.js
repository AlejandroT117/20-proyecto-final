const productoClr = require('../controllers/productosController')
const router = require("express").Router()

router.get('/load', productoClr.loadData)
router.get("/all", productoClr.get);
router.get("/:id", productoClr.getById);
router.post("/", productoClr.save);
router.put("/:id", productoClr.editById);
router.delete("/all", productoClr.deleteAll);
router.delete("/:id", productoClr.deleteById);

module.exports = router;