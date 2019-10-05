const express = require('express');
const router = express.Router();

const {
    body
} = require('express-validator');
const isAuth = require('../middleware/isAuth');

const feedController = require('../controllers/feed');

//GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

//POST /feed/post
router.post('/post', isAuth, [body('title')
    .trim()
    .isLength({
        min: 7
    }), body('content')
    .trim()
    .isLength({
        min: 5
    })
], feedController.postPost);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth, [body('title')
    .trim()
    .isLength({
        min: 7
    }), body('content')
    .trim()
    .isLength({
        min: 5
    })
], feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;