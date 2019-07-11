const express = require('express');
const Posts = require('./postDb.js');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    Posts.get()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            err = { error: "The posts information could not be retrieved" };
            res.status(500).json(err);
        })

});
router.get('/:id', validatePostId, (req, res) => {
    console.log('POST VALIDATED');
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Posts.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch(err => {
            err = { error: "The post could not be removed" };
            res.status(500).json(err);
        })
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    if (!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
    } else if (!changes.text) {
        res.status(400).json({ message: "missing required text field" });
    } else {
        Posts.update(id, changes)
            .then(updated => {
                if (updated) {
                    res.status(200).json(changes)
                }
            })
            .catch(err => {
                err = { error: "The post information could not be modified" };
                req.status(500).json(err);
            })
    }
});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params;
    Posts.getById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch(err => {
            err = { error: "The post information could not be retrieved" }
            res.status(500).json(err)
        })

    next();
};

module.exports = router; 
