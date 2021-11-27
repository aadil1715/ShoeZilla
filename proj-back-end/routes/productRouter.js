
const express = require('express');
const {listProducts} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.get('/products', listProducts)


module.exports = productRouter;