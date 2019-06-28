var express = require('express');
var router = express.Router();

const BitmapController = require("../controllers/BitmapController");

/* GET home page. */
router.get('/', function() {
  return new BitmapController().showResult();
});

module.exports = router;
