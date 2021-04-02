const Router = require('koa-router');
const ChatRecord = require('../../controller/chatRecord')
const chatRecordRouter = new Router();

chatRecordRouter
.get('/getChatRecord', ChatRecord.getRecord)
.get('/getChatList', ChatRecord.getChatList)

module.exports = chatRecordRouter