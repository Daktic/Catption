const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const photoRoute = require("./routes/photos");
const bcrypt = require("bcrypt");
const cors = require("cors");
const sessions = require("express-session");
const { sequelize } = require("./db");
const { DataTypes, Model } = require("sequelize");
const User = require("./models/users")(sequelize, DataTypes, Model);
const app = express();
const path = require("path");

app.use(cors());
app.use(bodyParser.json());
app.use("/user", userRoute);
app.use("/photo", photoRoute);

app.use(
  sessions({
    secret: "aeroVistaisTheBest420BlazeIt",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

let session;

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  session = req.session;
  if (session.userid) {
    res.send("Welcome User <a href='/logout'>click to logout</a>");
  } else res.sendFile(path.join(__dirname, "build", "index.html"));
  //res.sendFile("views/index.html", { root: __dirname });
});
app.post("/login", async (req, res) => {
  // Check if the user is registering
  const username = req.body.username;
  console.log("here");

  if (Boolean(req.query.register) === true) {
    const user = await User.findOne({
      where: { username: username },
    });
    if (user) {
      return res.status(400).json({ error: "Username taken" });
    } else {
      const saltRounds = 1;
      const hashed_password = await bcrypt.hash(req.body.password, saltRounds);
      const userId = await User.create({
        username: username,
        password: hashed_password,
      }); //return UserId
      if (userId) {
        return res.status(201).json({ success: "User created" });
      }
    }
  } else {
    const dbRes = await User.findAll({
      attributes: ["password"],
      where: {
        username: req.body.username,
      },
    });
    const dbPassword = dbRes[0].dataValues.password;

    if (await bcrypt.compare(req.body.password, dbPassword)) {
      res.send("success!");
    } else {
      res.send("invalid username/password");
    }
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
