const User = require('../models/user');
const {
    validationResult
} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name
            })
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User Created',
                userId: result._id
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUSer;
    User
        .findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                const error = new Error('User with given email not found');
                error.statusCode = 401;
                throw error;
            }
            loadedUSer = user;
            return bcrypt.compare(password, user.password)
        })
        .then(result => {
            if (!result) {
                const error = new Error('Wrong Password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUSer.email,
                userId: loadedUSer._id.toString()
            }, 'secret', {
                expiresIn: '1h'
            });
            res.status(200).json({
                token: token,
                userId: loadedUSer._id.toString()
            })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}

exports.getUserStatus = (req, res, next) => {
    User
        .findById(req.userId).then(user => {
            if (!user) {
                const error = new Error('User Not Found!');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                status: user.status
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.updateStatus = (req, res, next) => {
    const newStatus = req.body.status;
    User
        .findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User Not Found');
                error.statusCode = 404;
                throw error;
            }
            user.status = newStatus;
            return user.save();
        })
        .then(result=>{
            res.status(200).json({
                message: 'User Updated'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}