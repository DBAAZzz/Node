const Router = require('koa-router');
let Routers = new Router();

const userRouter = require('./router/userRouter');
const fileRouter = require('./router/fileRouter')


Routers.use('/file', fileRouter.routes())
Routers.use('/user', userRouter.routes())

module.exports = Routers;
