const Router = require('koa-router');
let Routers = new Router();

const userRouter = require('./router/userRouter');
const fileRouter = require('./router/fileRouter')
const authRouter = require('./router/authRouter')


Routers.use('/file', fileRouter.routes())
Routers.use('/user', userRouter.routes())
Routers.use('/auth', authRouter.routes())

module.exports = Routers;
