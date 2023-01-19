const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
    }

    Comment.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        photoId: {
            type: DataTypes.INTEGER,
            references: {
                model: Photo,
                key: 'id'
            }
        },
        commentText: {
            type: DataTypes.STRING
        }
    }, {sequelize});
    return Comment;
};