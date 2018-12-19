const express = require('express');
const router = express.Router();
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const http = require('http');
const querystring = require('querystring');


// get all user
router.post('/login', function (req, res, next) {
    User.findOne({username: req.body.username},
        function (err, user) {
            if (err) {
                // console.log(err);
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            if (!user) {
                // console.log(err);
                return res.status(404).json({
                    title: 'No User found',
                    error: {message: 'User not found'}
                })
            }
            const token = jwt.sign({user: user}, 'dvn', {expiresIn: 7200});
            if (sha256(req.body.password) === user.password) {
                return res.status(200).json({
                    login: true,
                    userID: user._id,
                    roleID: user.roleID,
                    userType: user.type,
                    token: token
                })
            } else {
                res.send({
                    login: false
                })
            }
        });

    // let getRqOptions = {
    //     host: '137.116.146.224',
    //     port: 3000,
    //     path: '/api/Student/20138724',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'x-api-key': 'toanhd'
    //     }
    // };
    //
    // let getStdResponse = '';
    // http.get(getRqOptions, function (responseFromRemoteApi) {
    //     responseFromRemoteApi.on('data', function (chunk) {
    //         getStdResponse += chunk;
    //     });
    //     responseFromRemoteApi.on('end', function () {
    //         res.status(200).json({
    //             a: 1
    //         })
    //     });
    // }).on('error', function (e) {
    //     console.log('Error when calling remote API: ' + e.message);
    // });
});

// get all user
router.get('/getusers', function (req, res, next) {
    // console.log('success get all plants');
    User.find({}, function (err, result) {
        res.status(200).json({
            status: 'success',
            users: result
        })
    });
});


router.post('/loginnnnn', function (req, res, next) {
    User.findOne({username: req.body.username},
        function (err, user) {
            if (err) {
                // console.log(err);
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            if (!user) {
                // console.log(err);
                return res.status(404).json({
                    title: 'No User found',
                    error: {message: 'User not found'}
                })
            }
            const token = jwt.sign({user: user}, 'dvn', {expiresIn: 7200});
            if (sha256(req.body.password) === user.password) {
                return res.status(200).json({
                    login: true,
                    userID: user._id,
                    userType: user.type,
                    token: token
                })
            } else {
                res.send({
                    login: false
                })
            }
        })
});

router.get('/:id', function (req, res, next) {
    console.log('get user infomation');
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if (!user) {
            return res.status(404).json({
                title: 'No User found',
                error: {message: 'User not found'}
            })
        }
        res.status(200).json({
            message: 'success',
            user: user
        })
    })
});

router.post('/register', async function (req, res, next) {
    try {
        const {firstName, lastName, password, type, username, roleID} = req.body;
        const user = new User({
            firstName, lastName, password: sha256(password), type, username, roleID
        });
        res.status(201).json({
            message: 'user created',
            user: await user.save()
        })
    } catch (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        })
    }
});

module.exports = router;