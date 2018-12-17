const router = require('express').Router();
const User = require('../models/user');

router.get('/', function (req, res, next) {

    return res.status(200).json({
        message: 'access default route',
    })
});


router.get('/read', function (req, res, next) {
    User.find({}, function (err, result) {
        res.status(200).json({
            status: 'success',
            users: result
        })
    });
});

router.post('/create', async function (req, res, next) {
    try {
        const {name, company, email, phone} = req.body;
        const user = new User({
            name, company, email, phone
        });
        res.status(201).json({
            message: 'user created',
            user: await user.save()
        })
    }
    catch (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        })
    }
});


// router.delete('/delete/:userID', function (req, res, next) {
//     User.remove({_id: req.params.userID}, function (err) {
//         if (!err) {
//             res.status(200).json({
//                 response: 'Deleted',
//             });
//         }
//         else {
//             res.status(500).json({
//                 response: 'failed',
//             });
//         }
//     });
// });

router.delete('/delete', async function (req, res, next) {
    try {
        const result = await User.remove({_id: {$in: req.body}});
        res.status(200).json({
            response: 'Deleted',
            result: result
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: 0,
            title: 'An error occurred',
            error: err
        })
    }
});


router.patch('/update', async function (req, res, next) {
    try {
        const cell = req.body.cell;
        const user = await User.findById(req.body.userId);
        user[cell] = req.body.cellValue;
        userResult = await user.save();
        res.status(200).json({
            response: 'Updated',
            newdata: userResult
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: 0,
            title: 'An error occurred',
            error: err
        })
    }
});

module.exports = router;
