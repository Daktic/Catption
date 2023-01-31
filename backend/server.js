const express = require('express')
const bodyParser = require('body-parser')
const userRoute = require("./routes/user");
const photoRoute = require("./routes/photos");
const bcrypt = require('bcrypt');
const cors = require('cors');
const sessions = require('express-session');
const {sequelize} = require("./db");
const {DataTypes, Model} = require("sequelize");
const User = require('./models/users')(sequelize, DataTypes,
    Model);
const app = express()


app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRoute);
app.use('/photo', photoRoute);


app.use(sessions({
    secret:"aeroVistaisTheBest420BlazeIt",
    saveUninitialized:true,
    cookie: {maxAge: 1000*60*60*24},
    resave: false
}));

let session;
app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
        res.sendFile('views/index.html',{root:__dirname})
});
app.post('/login', async (req, res) => {
    const dbRes = await User.findAll({
        attributes: ['password'],
        where: {
            username: req.body.username
        }
    })
    const dbPassword = dbRes[0].dataValues.password;

    if(await bcrypt.compare(req.body.password, dbPassword)) {
        res.send("success!")
    } else {
        res.send("invalid username/password")
    }
})


const port = 80;
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})