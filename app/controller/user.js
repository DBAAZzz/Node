const jsonwebtoken = require('jsonwebtoken') // 生成token
const User = require('../model/user')
const uuid = require('uuid')
const utils = require('../util/index')
const redis = require('../middleware/redis')
const secret = require('../../config').secret

class UserCtl{
    async login(ctx){
        ctx.status = 200
        // 对参数进行验证
        ctx.verifyParams({
            email: {
                type: 'string', required: true
            },
            passWord: {
                type: 'string', required: true
            },
        })
        const { email, passWord } = ctx.request.body;
        let regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!regEmail.test(email)){ 
            ctx.body = {
                code: 201,
                message: '请输入正确的邮箱格式！',
                data: {}
            }
            return ;
        }
        let user = await User.findOne({
            email: email
        });
        if(!user){
            ctx.body = {
                code: 400,
                message: '用户名或者密码不正确',
                data: {}
            }
            return;
        }else{
            let md5pass = await utils.MD5(passWord, user.id)
            if(md5pass !== user.passWord){
                ctx.body = {
                    code: 400,
                    message: '用户名或者密码不正确',
                    data: {}
                }
                return
            }else {
                const { id, userName } = user
                const token = await jsonwebtoken.sign({ id }, secret, {expiresIn: '1h'})
                ctx.body = {
                    code: 200,
                    message: '登录成功',
                    data: {
                        token: token
                    }
                }
                return
            }
        }
    }
    async find(ctx) {
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        ctx.body = {
            code: 200,
            message: '成功获取到数据',
            data: authData
        }
    }
    async create(ctx){
        ctx.status = 200
        // 对参数进行验证
        ctx.verifyParams({
            userName: {
                type: 'string', required: true
            },
            passWord: {
                type: 'string', required: true
            },
            email: {
                type: 'string', required: true
            },
            code: {
                type: 'string', require: true
            }
        })
        const { userName, passWord, email, code } = ctx.request.body
        let regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!regEmail.test(email)){ 
            ctx.body = {
                code: 201,
                message: '请输入正确的邮箱格式！',
                data: {}
            }
            return ;
        }
        let redisCode = await redis.getString(`${email}:singup`);
        if(redisCode == null || code != redisCode){
            ctx.body = {
                code: 201,
                message: '验证码错误',
                data: {}
            }
            return ;
        }
        let user = await User.findOne({
            email: email
        });
        if(user){
            ctx.body = {
                code: 400,
                message: '该邮箱已经被占用',
                data: {}
            }
            return ;
        }
        let id = uuid.v1();
        let md5pass = await utils.MD5(passWord, id)
        var newUser = User({
            id: id,
            userName: userName,
            passWord: md5pass,
            email: email
        });
        await newUser.save();
        redis.del(`${email}:singup`)
        ctx.body = {
            code: 200,
            massage: '注册成功',
            data: {}
        }
    }
}

module.exports = new UserCtl();