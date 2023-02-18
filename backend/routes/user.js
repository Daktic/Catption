const express = require("express");
const bcrypt = require('bcrypt');
const {DataTypes, Model} = require('sequelize');
const sequelize = require('../db').sequelize;
const jwt = require('jsonwebtoken');
require('dotenv').config()


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
});
userRoute.post('/', async (req, res, next) => {
        const username = req.body.username;

        const user = await User.findOne({
            where: {username: username}
        })
        if (!user) {
            return res.status(400).json({error: 'Invalid email or password'});
        }
        console.log(user)
        // compare the plaintext password with the hashed password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({error: 'Invalid email or password'});
        }
        // create a JWT token id the above two statements do not return
        const token = jwt.sign({userId: user.id}, process.env.TOKEN_SECRET, {expiresIn: 60});

        // return the token and the user object
        return res.json({
            success: {token, user}
        });
})
userRoute.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.sendStatus(500);
        }
        res.clearCookie('session_id');
        res.redirect('/');
    })
})


module.exports = userRoute;
