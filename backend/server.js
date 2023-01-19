const express = require('express')
const userRoute = require("./routes/user");

const app = express()


app.use('/user', userRoute);

