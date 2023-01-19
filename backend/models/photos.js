const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Photo extends Model {
    }

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
        source: {
            type:DataTypes.STRING,
            allowNull: false
        },
        posterId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        src: {
            type: DataTypes.STRING
        }
    }, {sequelize});
    return Photo;
};