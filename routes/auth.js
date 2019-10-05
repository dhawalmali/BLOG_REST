const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/isAuth');

const {
    body
} = require('express-validator');

router.post('/signup', [
    body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Please Enter a valid email')
    .custom((value, {
        req
    }) => {
        return User.findOne({
            email: value
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email already exists');
            }
        })
    }),
    body('password')
    .trim()
    .isLength({
        min: 5
    }),
    body('name')
    .trim()
    .not()
    .isEmpty()
], authController.signup);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth, [
    body('status')
    .trim()
    .not()
    .isEmpty()
], authController.updateStatus);


module.exports = router;