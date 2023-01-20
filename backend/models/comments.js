const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
    }

    Comment.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        commentText: {
            type: DataTypes.STRING
        }
    }, {sequelize});
    return Comment;
};