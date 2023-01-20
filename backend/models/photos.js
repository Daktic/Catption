const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Photo extends Model {}

    Photo.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        caption: {
            type: DataTypes.STRING,
            allowNull: true
        },
        src: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {sequelize});
    return Photo;
};