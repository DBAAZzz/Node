const mongoose = require('mongoose');

var OfflineMessageSchema = new mongoose.Schema({
    // 消息发送者id
    senderId: {
        type: String,
        required: true
    },
    // 消息接受者id
    receiverId: {
        type: String,
        required: true
    },
    // 发送时间
    time: {
        type: String,
        required: true
    },
    // 聊天类型
    type: {
        type: Number,
        required: true
    },
    // 消息内容
    content: {
        type: String,
        required: true
    }
})

var OfflineMessage = mongoose.model('OfflineMessage', OfflineMessageSchema);

module.exports = OfflineMessage