const mongoose = require('mongoose')

var ApplyList = new mongoose.Schema({
    // 申请内容
    content: {
        type: String,
        required: false
    },
    // 申请人id
    senderId:  {
        type: String,
        required: false,
    },
    // 被申请人id
    receiverId: {
        type: String,
        required: false
    },
    // 头像
    headImg: {
        type: String,
        required: false
    },
    userName: {
        type: String,
        required: false
    },
    /**
     * 申请状态
     * 1：未通过 2：已添加 3：已拒绝 4：已过期
     */
    status:  {
        type: Number,
        required: false,
        default: 1
    }
})

var ApplyList = mongoose.model('ApplyList', ApplyList)

module.exports = ApplyList