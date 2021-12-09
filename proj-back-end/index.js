require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRouter = require("./routes/productRouter");
const orderRouter = require("./routes/orderRouter");
const userRouter = require('./routes/userRoute');


// App Initialization
const app = express();
const port =  process.env.PORT;


// Middleware
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())


// Routers
app.use('/', productRouter);
app.use('/', orderRouter);
app.use('/', userRouter);

app.use((req, res) => {
    return res.status(404).json({
        message: 'You are looking for a page that doesnt exist on the backend.....Check the route you are hitting!',
        error: "Page not Found!"
    })
})

// Start listening to the requests
app.listen(port, () => {
    console.log("Started server on the port: " + port);
})
