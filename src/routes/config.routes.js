const router = require("express").Router();
const path = require('path')
const multer = require('multer')
const auth = require("../middlewares/auth");
const configController = require('../controllers/config.controller')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/img/users/'))
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '.png')
  }
})
const upload = multer({ storage })


router.get("/", auth, configController.showConfig)
router.post("/", upload.single("img"), configController.saveImg)

module.exports = router;