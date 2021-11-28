
const express = require('express');
const {listProducts, createProduct} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.get('/products', listProducts);

productRouter.post('/product/add', createProduct)


module.exports = productRouter;