const express = require("express");

const {photos} = require("../models/photos");
const {comments} = require("../models/comments");

const photoRoute = express.Router();


photoRoute.get('/', async (req, res) => {
    return await photos.findAll()
})
photoRoute.post('/', async (req, res) => {
    const userId = req.query.userId;
    const photoName = req.body.photo.name;
    const photoSource = req.body.photo.src
    return await photos.create({
        name: photoName,
        posterId: userId,
        source: photoSource
    })
})
photoRoute.get('/:id', async (req, res) => {
    const photoId = req.params.id;
    return await photos.findAll({
        where: {
            id: photoId
        }
    })
})
photoRoute.post('/:id', async (req, res) => {
    const photoId = req.params.id;
    const comment = req.body.comment;
    const userId = req.query.userId;
    return await comments.create({
        userId: userId,
        photoId: photoId,
        commentText: comment
    })
})




module.exports = photoRoute;