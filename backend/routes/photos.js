const express = require("express");
const {DataTypes, Model} = require("sequelize");
const sequelize = require('../db').sequelize;
const jwt = require('jsonwebtoken');
const {myCache, cacheMiddleware} = require('../cache')
const verifyToken = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers['Authorization'];


    // If there is no token, return a 401 error
    if (!token) {
        return res.redirect(401,'/user',{ message: 'No token provided' });
    }

    // Verify the token using the secret
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        // If the token is invalid, return a 401 error
        if (err) {
            return res.redirect(401,'/user',{ message: 'Invalid token' });
        }

        // Save the decoded token to the request object
        req.decoded = decoded;

        // Call the next middleware function
        next();
    });
}

const cacheController = async (req, res) => {
    try {
        const photoId = req.params.id;

        const photo = await Photo.findAll({
            attributes: ['name', 'caption', 'src'],
            where: {
                id: photoId
            }
        });

        const comments = await Comment.findAll({
            attributes: ['commentText'],
            where: {
                photoId: photoId
            }
        })

        const data = {
            photo:photo,
            comments:comments
        };

        myCache.set('photosComments', data);
        res.send(data);
        res.status(200);
    } catch (err) {
        res.status(500);
        console.log(err);
        throw err;
    }
}

// Bring in Models
const Photo = require('../models/photos')(sequelize, DataTypes,
    Model);
const Comment = require('../models/comments')(sequelize, DataTypes,
    Model);

const photoRoute = express.Router();


photoRoute.get('/', async (req, res) => {
    res.send(await Photo.findAll({
        attributes: ['id', 'name', 'caption', 'src']
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
photoRoute.get('/:id',cacheMiddleware, cacheController,  async (req, res) => {

})
photoRoute.post('/:id',
    verifyToken,
    async (req, res) => {
    const photoId = req.params.id;
    const comment = req.body.comment;
    const commentId = req.body.commentId;
    const userId = req.query.userId;
    const action = req.params.action;
    console.log({
        photoId:photoId,
        comment:comment,
        commentId: commentId,
        userId: userId,
        action:action
        }
    )
    if (!action || action === 'createComment') {
        res.send(
            await Comment.create({
                userId: userId,
                photoId: photoId,
                commentText: comment
            })
        )
    } else if (action === 'deleteComment') {
        res.send(
            await Comment.destroy({
                where: {
                    id:commentId
                }
            })
        )
    }

})




module.exports = photoRoute;