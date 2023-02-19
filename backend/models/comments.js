const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {}

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      photoId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Photos",
          key: "id",
        },
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      upVotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      commentText: {
        type: DataTypes.STRING,
      },
    },
    { sequelize }
  );
  return Comment;
};
