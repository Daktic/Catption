const { Sequelize, DataTypes, Model } = require("sequelize");

require("dotenv").config({ path: __dirname + "/.env" });

//initialize the database with the propper username and password
const postgresUser = process.env.POSTGRES_USER;
const postgresPass = process.env.POSTGRES_PASSWORD;

const sequelize = new Sequelize(
  `postgres://${postgresUser}:${postgresPass}@db:5432/photo_contest`
);

// This section seems totally unnecessary.
// Not sure what to do with it yet.
// seems import to have a sequelize connection somewhere

const User = require("./models/users");
const Photo = require("./models/photos");
const Comment = require("./models/comments");
const Votes = require("./models/votes");

const UserModel = User(sequelize, DataTypes);
const PhotoModel = Photo(sequelize, DataTypes);
const CommentModel = Comment(sequelize, DataTypes);
const voteModel = Votes(sequelize, DataTypes);

UserModel.hasMany(PhotoModel, {
  foreignKey: "id",
});
PhotoModel.belongsTo(UserModel);

UserModel.hasMany(CommentModel, {
  foreignKey: "id",
});
CommentModel.belongsTo(UserModel);

PhotoModel.hasMany(CommentModel, {
  foreignKey: "id",
});
CommentModel.belongsTo(PhotoModel);

UserModel.hasMany(voteModel, {
  foreignKey: "id",
});
voteModel.belongsTo(UserModel);

sequelize.sync({ force: false });
//CommentModel.sync({ force: true });

module.exports = {
  sequelize: sequelize,
};
