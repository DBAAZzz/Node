const mongoose = require('mongoose');

var MomentsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    }, 
    content: { 
        type: String,
        required: true,
    },
    imageList: {
        type: Array,
        required: false,
        default: []
    },
    publishTime: {
        type: String,
        required: true,
        default: +new Date(),
    },
    likeUserId: {
        type: Array,
        required: false,
        default: []
    },
    commentList: {
        type: Array,
        required: false,
        default: []
    }
})

var Moments = mongoose.model('Moments', MomentsSchema);

module.exports = Moments