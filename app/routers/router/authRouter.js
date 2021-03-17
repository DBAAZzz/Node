const Router = require('koa-router');
const sendEmail = require('../../middleware/sendMail')()
const authRouter = new Router();

authRouter
.post('/getCode', sendEmail)


module.exports = authRouter