const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getAllProductsStatic,
} = require("../controllers/products");

//main route (specified in app.js)
router.route("/").get(getAllProducts);
router.route("/static").get(getAllProductsStatic);

module.exports = router;
