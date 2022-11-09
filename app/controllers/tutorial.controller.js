const db = require("../models");
const Tutorial = db.tutorials;

exports.create = (req, res) => {
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

  Tutorial.find(condition)
    .then((data) => {
      if (data[0]?.email === requesteml) {
        res.status(400).send({ message: "Email already exists" });
      } else {
        // Create a Tutorial
        const tutorial = new Tutorial({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,

          //   description: req.body.description,
          //   published: req.body.published ? req.body.published : false
        });

        tutorial
          .save(tutorial)
          .then((data) => {
            res.send(data);
            ``;
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Tutorial.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
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
