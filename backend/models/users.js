const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model
    {
    }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    }, {sequelize})
    return User;
};