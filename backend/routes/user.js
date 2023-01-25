const express = require("express");
const bcrypt = require('bcrypt');
const {DataTypes, Model} = require('sequelize');
const sequelize = require('../db').sequelize;

// Bring in Model
const User = require('../models/users')(sequelize, DataTypes,
    Model);

const saltRounds = 1;

const userRoute = express.Router();

userRoute.get('/:id', async (req, res) => {
    const userId = req.params.id;
    res.send(
        await User.findAll({
            attributes: ['id', 'username'],
            where: {
                id: userId
            }
        })
    )
})

userRoute.post('/', async (req, res) => {
    const username = req.body.username;
    const hashed_password = await  bcrypt.hash(req.body.password, saltRounds);
    res.send(
        await User.create({username:username, password:hashed_password}) //return UserId
    )
})


module.exports = userRoute;
