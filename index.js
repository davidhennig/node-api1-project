// implement your API here
const express = require("express");

const Users = require("./data/db.js");

const server = express();

server.use(express.json());

server.use(cors());

server.get("/", function(req, res) {
  res.send({ hello: "Web 25! Hello Hello " });
});

server.post("/api/users", (req, res) => {
  const userData = req.body;
  //   console.log(userData);
  if (!userData.name || !userData.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  Users.insert(userData)
    .then(user => {
      Users.findById(user.id).then(response => {
        res.status(201).json(response);
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      });
    });
});

server.get("/api/users", (req, res) => {
  Users.find()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage:
          'errorMessage: "The users information could not be retrieved.'
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  Users.findById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  Users.findById(id).then(user => {
    if (!user) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  });
  Users.remove(id)
    .then(deleted => {
      res.status(200).json({ message: "User was deleted" });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  Users.findById(id).then(user => {
    if (!user) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  });
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  const name = req.body.name;
  const bio = req.body.bio;
  const sendObject = { name, bio };
  Users.update(id, sendObject)
    .then(updatedUser => {
      Users.findById(id).then(response => {
        res.status(200).json(response);
      });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ errorMessage: "The user information could not be modified." });
    });
});

const port = 8000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));
