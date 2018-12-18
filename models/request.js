const mongoose = require('mongoose');

const reqSchema = new mongoose.Schema({
        requester: {type: String, required: true},
        company: {type: String, required: true},
        email: {type: String, required: true},
        stdID: {type: Number, required: true},
        stdName: {type: String, required: true},
        intakeYear: {type: Number, required: true},
        reason: {type: String, required: true},
        reasonDetail: {type: String, required: false},
        status: {type: String, required: false},
    },
    {timestamps: true}
);

module.exports = mongoose.model('Req', reqSchema);