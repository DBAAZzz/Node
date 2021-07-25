const mongoose = require('mongoose');

var ChatRecordSchema = new mongoose.Schema({
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
    // 聊天对象。群聊可以是xxx@chatroom 用户则是聊天对象唯一id表示
    talker: {
        type: String,
        require: true
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

var ChatRecord = mongoose.model('ChatRecord', ChatRecordSchema);

module.exports = ChatRecord