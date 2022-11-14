const db = require("../models");
const sendEmail = require("../services/sendEmail");

const express = require("express");
const router = express.Router();

const Tutorial = db.tutorials;

router.post("/submit", async (req, res) => {
  try {
    const user = await Tutorial.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    const link = `http://localhost:3000/forgotPwd/${user._id}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

router.post("/processForm", async (req, res) => {
  try {
    console.log(req.query.userId);
    const user = await Tutorial.findById(req.query.userId);
    if (!user) return res.status(400).send("invalid link or expired");

    user.password = req.body.password;
    await user.save();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

module.exports = router;
