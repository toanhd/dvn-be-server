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
            switch (req.body.port) {
                case 'admin':
                    if (user.disabled) {
                        return res.status(403).json({
                            login: false,
                            message: 'Locked'
                        })
                    } else if (user.roleID == 'admin') {
                        const token = jwt.sign({user: user}, 'dvn_admin', {expiresIn: 7200});
                        if (sha256(req.body.password) === user.password) {
                            return res.status(200).json({
                                login: true,
                                token: token
                            })
                        } else {
                            res.send({
                                login: false
                            })
                        }
                    } else {
                        return res.status(403).json({
                            login: false,
                            message: 'Unauthorized'
                        })
                    }
                    break;
                case 'moe':
                    if (user.disabled) {
                        return res.status(403).json({
                            login: false,
                            message: 'Locked'
                        })
                    } else if (user.isMoE && user.roleID !== 'admin') {
                        const token = jwt.sign({user: user}, 'dvn_moe', {expiresIn: 7200});
                        if (sha256(req.body.password) === user.password) {
                            return res.status(200).json({
                                login: true,
                                token: token
                            })
                        } else {
                            res.send({
                                login: false
                            })
                        }
                    } else {
                        return res.status(403).json({
                            message: 'Unauthorized'
                        })
                    }
                    break;
                case 'hust':
                    if (user.disabled) {
                        return res.status(403).json({
                            login: false,
                            message: 'Locked'
                        })
                    } else if (!user.isMoE && user.roleID !== 'admin') {
                        const token = jwt.sign({user: user}, 'dv_hust', {expiresIn: 7200});
                        if (sha256(req.body.password) === user.password) {
                            return res.status(200).json({
                                userid: user.roleID,
                                login: true,
                                token: token
                            })
                        } else {
                            res.send({
                                login: false
                            })
                        }
                    } else {
                        return res.status(403).json({
                            message: 'Unauthorized'
                        })
                    }
                    break;
                default:
                    return res.status(400).json({
                        message: 'This is so so bad request!'
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


router.get('/:roleID', function (req, res, next) {
    User.findOne({roleID: req.params.roleID}, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if (!user) {
            return res.status(404).json({
                title: 'user not found',
                error: {message: 'User not found'}
            })
        }
        res.status(200).json({
            user: user
        })
    })
});

router.post('/register', async function (req, res, next) {
    User.findOne({username: req.body.username},
        async function (err, user) {
            if (err) {
                // console.log(err);
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            if (!user) {
                const {username, password, isMoE, roleID, disabled} = req.body;
                const user = new User({
                    username, password: sha256(password), isMoE, roleID, disabled
                });
                res.status(201).json({
                    message: 'user created',
                    user: await user.save()
                })
            } else {
                return res.status(404).json({
                    title: 'existed',
                    error: {message: 'this username is existed'}
                })
            }
        });
});

router.post('/changepwd', async function (req, res, next) {
    User.findOne({username: req.body.username},
        async function (err, user) {
            if (err) {
                // console.log(err);
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            } else {
                user.password = sha256(req.body.password);
                await user.save(function (err, updatedUser) {
                    if (err) return handleError(err);
                    res.send(updatedUser);
                });
            }

        });
});

router.post('/accstatus', async function (req, res, next) {
    User.findOne({username: req.body.username},
        async function (err, user) {
            if (err) {
                // console.log(err);
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            } else {
                user.disabled = req.body.disabled;
                user.save(function (err, updatedUser) {
                    if (err) return handleError(err);
                    res.send(updatedUser);
                });
            }

        });
});

router.post('/role', async function (req, res, next) {
    User.findOne({roleID: req.body.lecID},
        async function (err, user) {
            if (err) {
                // console.log(err);
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            } else {
                user.isMoE = req.body.isMoE;
                user.save(function (err, updatedUser) {
                    if (err) return handleError(err);
                    res.send(updatedUser);
                });
            }

        });
});


module.exports = router;