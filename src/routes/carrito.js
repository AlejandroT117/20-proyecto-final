const cartClr = require('../controllers/carritoController')
const router = require("express").Router()

router.get('/load', cartClr.loadData)
router.post("/", cartClr.save);
router.get("/all", cartClr.get);
router.get("/:id/user", cartClr.getByUserId);
router.get("/:id", cartClr.getById);
router.delete("/all", cartClr.deleteAll);
router.delete("/:id", cartClr.deleteById);
router.get("/:id/productos", cartClr.getProductsByIdCart );
router.post("/:id/productos", cartClr.saveProdByIdCart );
router.delete("/:id/productos/:id_prod", cartClr.deleteProductById );

module.exports = router;