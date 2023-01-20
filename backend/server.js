const express = require('express')
const bodyParser = require('body-parser')
const userRoute = require("./routes/user");
const photoRoute = require("./routes/photos");
const app = express()

app.use(bodyParser.json())
app.use('/user', userRoute);
app.use('/photo', photoRoute);



const port = 80;
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})