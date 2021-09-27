const Router = require('koa-router');
const User = require('../../controller/user')
const userRouter = new Router();

userRouter
.post('/register', User.create)
.post('/login', User.login)
.post('/addFriends', User.addFrinds)
.post('/searchUser', User.searchUser)
.post('/applyFriends', User.applyToFriends)
.get('/getApplyList', User.getApplyList)
.get('/getFriendsList', User.getFrindsList)
.get('/getUserInfo', User.getUserInfo)


module.exports = userRouter