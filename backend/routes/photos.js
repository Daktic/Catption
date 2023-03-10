const express = require("express");
const { DataTypes, Model, QueryTypes } = require("sequelize");
const sequelize = require("../db").sequelize;
const jwt = require("jsonwebtoken");
const { myCache, cacheMiddleware } = require("../cache");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers["authorization"];

  // If there is no token, return a 401 error
  if (!token) {
    console.log("no token");
    return res.redirect(401, "/login", { message: "No token provided" });
  }

  // Verify the token using the secret
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    // If the token is invalid, return a 401 error
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "Invalid token" });
    }

    // Save the decoded token to the request object
    req.decoded = decoded;
    // Call the next middleware function
    next();
  });
};

const onlyOwner = (req, res, next) => {
  // Get the token from the req
  const token = req.decoded;

  if (token.userName !== daktic) {
    res.send(403);
  }
  next();
};

const cacheController = async (req, res) => {
  try {
    const photoId = req.params.id;

    const photo = await Photo.findAll({
      attributes: ["name", "caption", "src"],
      where: {
        id: photoId,
      },
    });

    // I do not understand why I must bring this in. do I do the same for the other models?
    const User = require("../models/users")(sequelize, DataTypes, Model);

    const comments = await sequelize.query(
      'SELECT "Comments"."id", "commentText","username","upVotes","Comments"."createdAt" FROM "Comments" JOIN "Users" ' +
        'ON "Users"."id" = "Comments"."userId" WHERE "Comments"."photoId" = :photoId ' +
        'ORDER BY "upVotes" DESC',
      {
        replacements: {
          photoId: photoId,
        },
        type: QueryTypes.SELECT,
      }
    );

    const data = {
      photo: photo,
      comments: comments,
    };

    myCache.set("photosComments", data);
    res.send(data);
    res.status(200);
  } catch (err) {
    res.status(500);
    console.log(err);
    throw err;
  }
};

// Bring in Models
const Photo = require("../models/photos")(sequelize, DataTypes, Model);
const Comment = require("../models/comments")(sequelize, DataTypes, Model);
const Vote = require("../models/votes")(sequelize, DataTypes, Model);

const photoRoute = express.Router();

photoRoute.get("/", async (req, res) => {
  res.send(
    await Photo.findAll({
      attributes: ["id", "name", "caption", "src"],
    })
  );
});
photoRoute.post("/", verifyToken, onlyOwner, async (req, res) => {
  const userId = req.query.userId;
  const photoName = req.body.photo.name;
  const photoSource = req.body.photo.src;
  res.send(
    await Photo.create({
      name: photoName,
      posterId: userId,
      src: photoSource,
    })
  );
});
photoRoute.get(
  "/:id",
  cacheController,
  cacheMiddleware,
  async (req, res) => {}
);
photoRoute.post("/:id", verifyToken, async (req, res) => {
  const photoId = req.params.id;
  const comment = req.body.comment;
  const commentId = req.body.commentId;
  const userId = req.query.userId;
  const action = req.query.action;
  //
  // console.log(
  //   `photoId: ${photoId} \n`,
  //   `comment: ${comment} \n`,
  //   `commentId: ${commentId} \n`,
  //   `userId: ${userId} \n`,
  //   `action: ${action} \n`
  // );

  //This function checks if the user has voted this direction already
  const checkVotesEligibliltiy = async (newVoteValue) => {
    const voteValue = await Vote.findOne({
      where: {
        commentId: commentId,
        userId: userId,
      },
    });

    if (voteValue) {
      console.log(
        `new Vote Value: ${newVoteValue} \n`,
        `old Vote Value: ${voteValue.value} \n`,
        `new Total: ${newVoteValue + voteValue.value} \n`
      );
    }

    if (!voteValue) {
      console.log(`commentId: ${commentId} \n`, `userId: ${userId} \n`);
      await Vote.create({
        commentId: commentId,
        userId: userId,
        value: newVoteValue,
      });
      return true;
    } else if (
      voteValue.value + newVoteValue <= 1 &&
      voteValue.value + newVoteValue >= -1
    ) {
      console.log(voteValue.value + newVoteValue);
      try {
        const newvalue = voteValue.value + newVoteValue;
        await voteValue.update({
          value: newvalue,
          where: {
            commentId: commentId,
            userId: userId,
          },
        });
        return true;
      } catch (err) {
        console.log("failed");
        return false;
      }
    }
    return false;
  };

  if (!action || action === "createComment") {
    res.send(
      await Comment.create({
        userId: userId,
        photoId: photoId,
        commentText: comment,
      })
    );
  } else if (action === "deleteComment") {
    res.send(
      await Comment.destroy({
        where: {
          id: commentId,
        },
      })
    );
  } else if (action === "upvote") {
    //revert if upvote check fails
    if ((await checkVotesEligibliltiy(1)) === false) {
      return;
    }
    const currentUpvoteCount = await Comment.findOne({
      attributes: ["upVotes"],
      where: {
        id: commentId,
      },
    });

    const newUpvoteCount = currentUpvoteCount.dataValues.upVotes + 1;
    res.send(
      await Comment.update(
        {
          upVotes: newUpvoteCount,
        },
        {
          where: {
            id: commentId,
          },
        }
      )
    );
  } else if (action === "downvote") {
    //revert if upvote check fails
    if ((await checkVotesEligibliltiy(-1)) === false) {
      return;
    }

    const currentUpvoteCount = await Comment.findOne({
      attributes: ["upVotes"],
      where: {
        id: commentId,
      },
    });

    const newUpvoteCount = currentUpvoteCount.dataValues.upVotes - 1;
    res.send(
      await Comment.update(
        {
          upVotes: newUpvoteCount,
        },
        {
          where: {
            id: commentId,
          },
        }
      )
    );
  }
});

module.exports = photoRoute;
