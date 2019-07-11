const express = require('express');

const router = express.Router();

const db = require('./postDb');

router.get('/', async (req, res) => {
    try {
        const posts = await db.get(req.query);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving posts'})
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await db.getById(req.params.id);
    
        if (post) {
            res.status(200).json({ post })
        } else {
            res.status(404).json({ message: 'Post not found!' })
        }
    } catch (error) { 
        res.status(500).json({ message: 'Error retrieving post' })
    }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const count = await db.remove(req.params.id);
            if (count > 0) {
                res.status(200).json({ message: 'Deleted!' })
            } else {
                res.status(404).json({ message: 'Unable to be deleted!' })
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting post!' })
        }
        });

        router.put('/:id', async (req, res) => {
            try {
                const post = await db.update(req.params.id, req.body);
                if (post) {
                    res.status(200).json(post)
                } else {
                    res.status(404).json({ message: 'Post could not be found!' })
                }
            } catch (error) {
                res.status(500).json({ message: 'Error updating post' })
            }
            });

            function validatePostId(req, res, next) {

            }

            module.exports = router;