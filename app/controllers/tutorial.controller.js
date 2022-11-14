const db = require("../models");
const { encrypt } = require("../services/crypto");
const { generateOTP } = require("../services/OTP");
const { sendMail } = require("../services/MAIL");

const Tutorial = db.tutorials;

exports.create = async (req, res) => {
  console.log("hello>>>>", req.body);
  // Validate request
  if (!req.body.firstName) {
    res.status(400).send({ message: "firstname can not be empty!" });
    return;
  }
  if (!req.body.lastName) {
    res.status(400).send({ message: "lastname can not be empty!" });
    return;
  }
  if (!req.body.email) {
    res.status(400).send({ message: "lastname can not be empty!" });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({ message: "password can not be empty!" });
    return;
  }

  let requesteml = req.body.email;

  console.log(">>>1");
  var condition = requesteml ? { email: requesteml } : {};
  console.log(">>>2", condition);
  try {
    const data = await Tutorial.find(condition);

    if (data[0]?.email === requesteml) {
      res.status(400).send({ message: "Email already exists" });
    } else {
      const data = await createUser(req);
      res.send(data);
    }
  } catch (error) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials.",
    });
  }
};

const createUser = async (req) => {
  const hashedPassword = await encrypt(req.body.password);
  const otpGenerated = generateOTP();
  const email = req.body.email;
  // Create a Tutorial
  const tutorial = new Tutorial({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email,
    password: hashedPassword,
    otp: otpGenerated,
  });

  const newUser = tutorial.save(tutorial);
  // const newUser = await User.create({
  //   email,
  //   password: hashedPassword,
  //   otp: otpGenerated,
  // });
  if (!newUser) {
    return [false, "Unable to sign you up"];
  }
  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
    });
    return [true, newUser];
  } catch (error) {
    console.log({ error });
    return [false, "Unable to send email, Please try again later", error];
  }
};

// Retrieve all Tutorials/ find by title from the database:

exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email ? { email: email } : {};

  Tutorial.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
// login

exports.login = (req, res) => {
  if (!req.query.password) {
    res.status(400).send({ message: "password can not be empty!" });
    return;
  }
  if (!req.query.email) {
    res.status(400).send({ message: "email can not be empty!" });
    return;
  }

  const email = req.query.email;
  let requestPwd = req.query.password;
  var condition = email ? { email: email } : {};

  Tutorial.find(condition)
    .then((data) => {
      console.log(data[0]);
      console.log(requestPwd);
      if (data[0].password === requestPwd) {
        res.send(data);
      } else {
        res.status(400).send({ message: "password is not matching!" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
