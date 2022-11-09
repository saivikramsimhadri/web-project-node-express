const db = require("../models");
const Tutorial = db.tutorials;

// Create and Save a new Tutorial
// exports.create = (req, res) => {};

// // Retrieve all Tutorials from the database.
// exports.findAll = (req, res) => {};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {};

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
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials/ find by title from the database:

exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email ? { email: /`${email}`/i } : {};

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

// Update function

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

//   Delete a Tutorial with the specified id:

exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database:

exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};
