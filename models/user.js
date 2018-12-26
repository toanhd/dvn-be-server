const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isMoE: {type: Boolean, required: true},
    disabled: {type: Boolean, required: true},
    roleID: {type: String, required: true},
});

module.exports = mongoose.model('User', userSchema);