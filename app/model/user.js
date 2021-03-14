const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }, 
    passWord: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    }
})

var User = mongoose.model('User', UserSchema);

module.exports = User