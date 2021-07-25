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
    },
    friends: {
        type: Array,
        required: false,
        default: []
    },
    headImg: {
        type: String,
        required: false,
        default: 'http://139.196.100.226/images/head.png'
    },
    sex: {
        type: Number,
        required: false
    },
    intro: {
        type: String,
        required: false,
        default: ''
    }
    
})

var User = mongoose.model('User', UserSchema);

module.exports = User