const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    roleID: {type: String, required: true},
});

module.exports = mongoose.model('User', userSchema);