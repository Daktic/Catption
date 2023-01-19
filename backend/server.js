const express = require('express')
const userRoute = require("./routes/user");
const photoRoute = require("./routes/photos");
const app = express()


app.use('/user', userRoute);
app.use('/photo', photoRoute);
