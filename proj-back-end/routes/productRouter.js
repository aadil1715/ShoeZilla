const express = require('express');
const {
    listProducts,
    createProduct,
    getProductById,
    getAProduct,
    deleteProduct
} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.param('productId', getProductById)

productRouter.get('/product/:productId', getAProduct)
productRouter.get('/products', listProducts);

productRouter.post('/product/add', createProduct)
productRouter.delete('/product/:productId', deleteProduct)

module.exports = productRouter;