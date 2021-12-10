require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const debug = require('debug')('index:');
const productRouter = require("./routes/productRouter");
const orderRouter = require("./routes/orderRouter");
const userRouter = require('./routes/userRoute');


// App Initialization
const app = express();
app.use(cors());
const port = process.env.PORT || 5050;


// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())



// Routers
app.use('/', productRouter);
app.use('/', orderRouter);
app.use('/', userRouter);


// Start listening to the requests
app.listen(port, () => {
    debug("hey");
    console.log("Started server on the port: " + port);
})
