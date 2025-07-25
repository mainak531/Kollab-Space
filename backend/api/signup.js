const route = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../db/model").User;
const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret123";

function generateAccessToken(userInfo) {
  return jwt.sign(userInfo, TOKEN_SECRET);
}

route.post("/", async (req, res) => {
  try {
    const result = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (result) {
      res.send({ error: "Username already taken" });
    } else {
      const userObject = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        gender: req.body.gender,
      };
      User.create(userObject);
      const token = generateAccessToken(userObject);
      res.json({
        data: {
          token,
        },
      });
    }
  } catch (err) {
    res.send({ error: err });
  }
});

exports = module.exports = route;
