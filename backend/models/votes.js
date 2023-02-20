const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Votes extends Model {}

  Votes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      commentId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Comments",
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
      value: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: -1, // minimum value
          max: 1, // maximum value
        },
      },
    },
    { sequelize }
  );
  return Votes;
};
