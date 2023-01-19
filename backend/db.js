const { Sequelize, DataTypes, Model } = require('sequelize');

require('dotenv').config({path:__dirname+'/../.env'})

//initialize the database with the propper username and password
const postgresUser = process.env.POSTGRES_USERNAME;
const postgresPass = process.env.POSTGRES_PASSWORD;
const sequelize = new Sequelize(`postgres://${postgresUser}:${postgresPass}@localhost:5432/photo_contest`);

const users = require('./models/users');
const photos = require('./models/photos');
const comments = require('./models/comments');


module.exports = {users, photos, comments};


