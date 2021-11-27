const express = require('express');
const {getOrders} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.get('/orders', getOrders)

module.exports =  orderRouter;