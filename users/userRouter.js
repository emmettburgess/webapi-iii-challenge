const express = require('express');
const Users = require('./userDb.js');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    console.log('USER CREATED');
});

router.post('/:id/posts', validatePost, (req, res) => {
    console.log('USER CREATED POST');
});

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            err = { error: "The users information could not be retrieved" };
            res.status(500).json(err);
        })
});

router.get('/:id', validateUserId, (req, res) => {
    console.log('USER VALIDATED');
});

router.get('/:id/posts', (req, res) => {
    const { id } = req.params;

    Users.getUserPosts(id)
        .then(posts => {
            if (posts && posts.length) {
                res.status(200).json(posts);
            } else {
                res.status(400).json({ message: 'mising  required text field' });
            }
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.params;

    Users.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end();
            }
        })
        .catch(err => {
            err = { error: "The user could not be removed" };
            res.status(500).json(err);
        })

});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    if (!id) {
        res.status(404).json({ message: "The user with the specified ID does not exist" });
    } else if (!changes.name) {
        res.status(400).json({ errorMessage: "Please provide a name for the user" });
    } else {
        Users.update(id, changes)
            .then(updated => {
                if (updated) {
                    res.status(200).json(changes);
                }
            })

            .catch(err => {
                err = { error: "The user information could not be modified" };
                res.status(500).json(err);
            })
    }
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    Users.getById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
            }
        })
    next();
};

function validateUser(req, res, next) {

    const userData = req.body;
    if (!userData) {
        res.status(400).json({ message: "missing user data" });
    } else if (!userData.name) {
        res.status(400).json({ message: "missing required name field" });
    } else {
        Users.insert(userData)
            .then(user => {
                if (user) {
                    res.status(201).json(userData)
                }
            })
            .catch(err => {
                err = { error: "There was an error while saving the user to the database" };
                res.status(500).json(err);
            })
    }
    next();
};

function validatePost(req, res, next) {

    const { text } = req.body;
    const user_id = parseInt(req.params.id);
    const userPost = ({ text, user_id })

    if (!userPost.text || !userPost) {
        res.status(400).json({ message: "missing post data" });
    } else {
        Posts.insert(userPost)
            .then(post => {
                if (post) {
                    res.status(201).json(userPost)
                }
            })
            .catch(err => {
                err = { error: "There was an error while saving the post to the database" };
                res.status(500).json(err)
            })
    }
    next();
};

module.exports = router;