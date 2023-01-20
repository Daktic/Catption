const express = require("express");
const {DataTypes, Model} = require("sequelize");
const sequelize = require('../db').sequelize;

// Bring in Models
const Photo = require('../models/photos')(sequelize, DataTypes,
    Model);
const Comment = require('../models/comments')(sequelize, DataTypes,
    Model);

const photoRoute = express.Router();


photoRoute.get('/', async (req, res) => {
    res.send(await Photo.findAll({
        attributes: ['name', 'caption', 'src']
    }))
})
photoRoute.post('/', async (req, res) => {
    const userId = req.query.userId;
    const photoName = req.body.photo.name;
    const photoSource = req.body.photo.src
    res.send(
        await Photo.create({
            name: photoName,
            posterId: userId,
            src: photoSource
        })
    )
})
photoRoute.get('/:id', async (req, res) => {
    const photoId = req.params.id;
    res.send(
        await Photo.findAll({
            attributes: ['name', 'caption', 'src'],
            where: {
                id: photoId
            }
        })
    )
})
photoRoute.post('/:id', async (req, res) => {
    const photoId = req.params.id;
    const comment = req.body.comment;
    const userId = req.query.userId;

    res.send(
        await Comment.create({
            userId: userId,
            photoId: photoId,
            commentText: comment
        })
    )
})




module.exports = photoRoute;