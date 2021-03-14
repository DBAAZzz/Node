const Router = require('koa-router');
let Routers = new Router();

const userRouter = require('./router/userRouter');

Routers.use('/user', userRouter.routes())

module.exports = Routers;
