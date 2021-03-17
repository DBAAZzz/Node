const Koa = require('koa');  //引入koa框架
const bodyParser = require('koa-bodyparser') 
const app = new Koa();
const mongoose = require('./app/mongodb'); // 连接mongoDB数据库
const parameter = require("koa-parameter"); // 校验传参
const router = require('./app/routers/index')
const jwt = require('koa-jwt') // 鉴权
const secret = require('./config').secret // 密钥
const auth = jwt({secret})

app.use(bodyParser());

/* 当token被拦截返回401时，处理一下返回的数据
   这个要放在app.use(auth)前面 */
app.use((ctx, next) => {
    return next().catch((err) => {
        if(err.status === 401){
            ctx.status = 200;
            ctx.body = {
                code: 300,
                message: 'token失效，请重新登录',
                data: {}
            }
        }else{
            throw err
        }
    })
})

// 使用unless来排除掉不需要token的接口
app.use(auth.unless({
   path: [/\/user\/login/, /\/user\/register/] 
}))

app.use(router.routes(), router.allowedMethods())
app.use(parameter(app));

app.listen(3000, () => {
    console.log("现在开始监听3000端口");
})