require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const debug = require('debug')('index:');
const productRouter = require("./routes/productRouter");
const orderRouter = require("./routes/orderRouter");


// App Initialization
const app = express();
const port = process.env.PORT || 5050;


// Middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors());


// Routers
app.use('/', productRouter);
app.use('/', orderRouter);


// Start listening to the requests
app.listen(port, () => {
    debug("hey");
    console.log("Started server on the port: " + port);
})
