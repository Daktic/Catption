const express = require("express");
const bcrypt = require('bcrypt');
const {users} = require('../models/users');

const saltRounds = 42;

const userRoute = express.Router();

userRoute.get('/:id', async (req, res) => {
    const userId = req.params.id;
    return await users.findAll({
        where: {
            id: userId
        }
    })
})

userRoute.post('/', (req, res) => {
    const username = req.body.username;
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
       return await users.create({username:username, password:hash}) //return UserId
    })
})


module.exports = userRoute;
