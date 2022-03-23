const productoClr = require('../controllers/productosController')
const productoFbClr = require('../controllers/productosFbClr')
const router = require("express").Router()

router.get('/load', productoClr.loadData)
router.get("/all", productoClr.get);
router.get("/:id", productoClr.getById);
router.post("/", productoClr.save);
router.put("/:id", productoClr.editById);
router.delete("/all", productoClr.deleteAll);
router.delete("/:id", productoClr.deleteById);

router.get('/fb/load', productoFbClr.loadData)
router.get("/fb/all", productoFbClr.get);
router.get("/fb/:id", productoFbClr.getById);
router.post("/fb/", productoFbClr.save);
router.put("/fb/:id", productoFbClr.editById);
router.delete("/fb/all", productoFbClr.deleteAll);
router.delete("/fb/:id", productoFbClr.deleteById);

module.exports = router;