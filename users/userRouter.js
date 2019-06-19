const express = require("express");

const router = express.Router();

const db = require("./userDb");
const postDb = require("../posts/postDb");

router.post("/", validateUser, async (req, res) => {
  try {
        //validate body to make sure there is a name
        const user = await db.insert(req.body);
        res.status(201).json(user);
    } 
    catch (error) {
        res.status(500).json({
        message: "Error adding the user"
        });
    }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {

    const newPost = { text: req.body.text, user_id: req.params.id };
    postDb
    .insert(newPost)
    .then( post => {
        res.status(201).json(post)
    })
    .catch( error => {
        res.status(500).json({ message: "Error adding the post!" })
    })
});

router.get("/", validateUser, async (req, res) => {
  try {
        const users = await db.get(req.query);
        res.status(200).json(users);
    } 
    catch (error) {
    res.status(500).json({
      message: "Error retrieving the users"
    });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
    db.getUsersPosts(req.params.id) 
    .then( posts => {
        if (posts) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({ message: "user post not found!"})
        }
    })
    .catch(err => {
        res.status(500).json({ message: "AHHHHHH SOMETHING IS WRONG"})
    })
});

router.delete("/:id", async (req, res) => {

  try {
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "The user has been nuked" });
    } else {
      res.status(404).json({ message: "The user could not be found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error removing the user"
    });
  }
});

router.put("/:id", validateUserId, async (req, res) => {
  try {
    const user = await db.update(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "The user could not be found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating the user"
    });
  }
});

//custom middleware

function validateUserId(req, res, next) {
  db.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Error retrieving the user"
      });
    });
}

function validateUser(req, res, next) {
    if ( !req.body ) {
        res.status(400).json({ message: "missing user data" })
    } else if ( !req.body.name ) {
        res.status(400).json({ message: "missing required name field" })
    } else {
        next();
    }
}

function validatePost(req, res, next) {
    if ( !req.body ) {
        res.status(400).json({ message: "missing post data" })
    } else if ( !req.body.text ) {
        res.status(400).json({ message: "missing required text field" })
    } else {
        next();
    }
}

module.exports = router;