const jsonwebtoken = require('jsonwebtoken') // 生成token
const User = require('../model/user')
const uuid = require('uuid')
const secret = require('../../config').secret

class UserCtl{
    async login(ctx){
        ctx.status = 200
        // 对参数进行验证
        ctx.verifyParams({
            userName: {
                type: 'string', required: true
            },
            passWord: {
                type: 'string', required: true
            },
        })
        const { userName, passWord } = ctx.request.body
        let user = await User.findOne({
            userName: userName
        });
        if(!user){
            ctx.body = {
                code: 400,
                message: '用户名或者密码不正确',
                data: {}
            }
            return;
        }else{
            if(passWord !== user.passWord){
                ctx.body = {
                    code: 400,
                    message: '用户名或者密码不正确',
                    data: {}
                }
                return
            }else {
                const { id, userName} = user
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
        let token = authorization.split(' ')[1];
        // 验证token的真实性，并获得token里面的是数据
        let authData = jsonwebtoken.verify(token, secret)
        console.log(authData);
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
            }
        })
        const { userName, passWord, email } = ctx.request.body
        
        let user = await User.findOne({
            userName: userName
        });
        if(user){
            ctx.body = {
                code: 400,
                message: '用户已存在',
                data: {}
            }
            return ;
        }
        var newUser = User({
            id: uuid.v1(),
            userName: userName,
            passWord: passWord,
            email: email
        });
        await newUser.save();
        ctx.body = {
            code: 200,
            massage: '注册成功',
            data: {}
        }
    }
}

module.exports = new UserCtl();