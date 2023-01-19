const express = require("express");
const bcrypt = require('bcrypt');
const {users} = require('../db');

const saltRounds = 42;

const userRoute = express.Router();

userRoute.get('/:id', (req, res) => {
    const userId = req.params.id;

})

userRoute.post('/', (req, res) => {
    const username = req.body.username;
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
       return await users.create({username:username, password:hash}) //return UserId
    })
})


module.exports = userRoute;
