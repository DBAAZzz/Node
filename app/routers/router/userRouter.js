const Router = require('koa-router');
const User = require('../../controller/user')
const userRouter = new Router();

userRouter
.post('/register', User.create)
.post('/login', User.login)
.post('/test', User.find)
.post('/addFriends', User.addFrinds)
.get('/getFriendsList', User.getFrindsList)
.get('/getUserInfo', User.getUserInfo)


module.exports = userRouter