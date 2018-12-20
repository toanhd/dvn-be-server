const express = require('express');
const router = express.Router();
const Request = require('../models/request');
const mailSend = require('./answer-request-mail-sending');

router.post('/send-mail', function (req, res, next) {
    const mailOptions = {
        from: "DVN - Ministry of Education Portal",
        to: req.body.to,
        subject: "[Cổng thông tin xác thực bảng điểm] - Kết quả xác thực!",
        generateTextFromHTML: true,
        html: req.body.html
    };
    mailSend.smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
            mailSend.smtpTransport.close();
            res.status(500).json({
                status: 'send mail failed'
            })
        } else {
            console.log(response);
            mailSend.smtpTransport.close();
            res.status(200).json({
                status: 'success'
            })
        }
    });
});

// get all requests
router.get('/', function (req, res, next) {
    console.log('success get all requests');
    Request.find({}, function (err, result) {
        res.status(200).json({
            status: 'success',
            requests: result
        })
    });
});

// create request
router.post('/', function (req, res, next) {
    const request = new Request(req.body);
    request.save(function (err, result) {
        if (err) {
            console.log('An error occurred');
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        console.log('request created');
        res.status(201).json({
            message: 'request created',
            obj: result
        })
    })
});

// Change status
router.patch('/', async function (req, res, next) {
    try {
        const request = await Request.findById(req.body.request_id);
        if (!request) {
            console.log('No request found');
            return res.status(404).json({
                success: 0,
                title: 'No request found',
                error: {message: 'Request not found'}
            })
        } else {
            request.status = req.body.status;
            request.save(function (err, result) {
                if (err) {
                    console.log('An error occurred');
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    })
                }
                console.log('request status changed');
                res.status(201).json({
                    message: 'request status changed',
                    obj: result
                })
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: 0,
            title: 'An error occurred',
            error: err
        })
    }
});

module.exports = router;