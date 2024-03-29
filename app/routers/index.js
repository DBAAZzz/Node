const Router = require('koa-router');
let Routers = new Router();

const userRouter = require('./router/userRouter');
const fileRouter = require('./router/fileRouter')
const authRouter = require('./router/authRouter')
const chatRouter = require('./router/chatRouter')
const momentsRouter = require('./router/momentsRouter')

Routers.use('/file', fileRouter.routes())
Routers.use('/user', userRouter.routes())
Routers.use('/auth', authRouter.routes())
Routers.use('/chat', chatRouter.routes())
Routers.use('/moments', momentsRouter.routes())

module.exports = Routers;
