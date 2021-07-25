const Router = require('koa-router');
const Moments = require('../../controller/moments')
const userRouter = new Router();

userRouter
.post('/publish', Moments.create)
.get('/getAllMoments', Moments.get)
.post('/likes', Moments.likes)
.post('/comment', Moments.comment)

module.exports = userRouter