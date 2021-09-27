const jsonwebtoken = require('jsonwebtoken') // 生成token
const User = require('../model/user')
const ApplyList = require('../model/applyList')
const uuid = require('uuid')
const utils = require('../util/index')
const redis = require('../middleware/redis')
const secret = require('../../config').secret
const pySegSort = require('../util/pySegSort')

class UserCtl {
    // 登录
    async login(ctx) {

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
        if (!regEmail.test(email)) {
            ctx.body = {
                code: 400,
                message: '请输入正确的邮箱格式！',
                data: {}
            }
            return;
        }
        let user = await User.findOne({
            email: email
        });
        if (!user) {
            ctx.body = {
                code: 400,
                message: '用户名或者密码不正确',
                data: {}
            }
            return;
        } else {
            let md5pass = await utils.MD5(passWord, user.id)
            if (md5pass !== user.passWord) {
                ctx.body = {
                    code: 400,
                    message: '用户名或者密码不正确',
                    data: {}
                }
                return
            } else {
                const { id, userName } = user
                const token = await jsonwebtoken.sign({ id }, secret, { expiresIn: '1d' })
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
    // 注册用户
    async create(ctx) {
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
        if (!regEmail.test(email)) {
            ctx.body = {
                code: 400,
                message: '请输入正确的邮箱格式！',
                data: {}
            }
            return;
        }
        let redisCode = await redis.getString(`${email}:singup`);
        if (redisCode == null || code != redisCode) {
            ctx.body = {
                code: 400,
                message: '验证码错误',
                data: {}
            }
            return;
        }
        let user = await User.findOne({
            email: email
        });
        if (user) {
            ctx.body = {
                code: 400,
                message: '该邮箱已经被占用',
                data: {}
            }
            return;
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
    // 根据邮箱搜索用户
    async searchUser(ctx) {
        ctx.status = 200
        ctx.verifyParams({
            key: {
                type: 'string', required: true
            }
        })
        const { key } = ctx.request.body;
        let regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!regEmail.test(key)) {
            ctx.body = {
                code: 400,
                message: '请输入正确的邮箱格式！',
                data: {}
            }
            return;
        }
        let user = await User.findOne({
            email: key
        });
        if (!user) {
            ctx.body = {
                code: 400,
                message: '该用户不存在',
                data: {}
            }
            return
        }
        ctx.body = {
            code: 200,
            message: '搜索成功',
            data: {
                id: user.id,
                userName: user.userName,
                headImg: user.headImg
            }
        }
        return
    }
    // 申请添加为好友
    async applyToFriends(ctx) {
        ctx.status = 200
        ctx.verifyParams({
            id: {
                type: 'string', required: true
            },
            content: {
                type: 'string', required: false
            }
        })
        const { id, content } = ctx.request.body;
        let user = await User.findOne({
            id: id
        });
        if (!id || !user) {
            ctx.body = {
                code: 400,
                message: '没有该用户',
                data: {}
            }
            return
        }
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        if (id == authData.id) {
            ctx.body = {
                code: 400,
                message: '你们已经是好友了',
                data: {}
            }
            return
        }
        let own = await User.findOne({
            id: authData.id
        })
        var newApply = ApplyList({
            content: content || '',
            senderId: authData.id,
            receiverId: id,
            headImg: own.headImg,
            userName: own.userName
        })
        await newApply.save();
        ctx.body = {
            code: 200,
            message: '申请成功',
            data: {}
        }
        return
    }
    // 查找申请列表
    async getApplyList(ctx) {
        ctx.status = 200
        const { authorization } = ctx.request.header;
        let { id } = utils.getIdByToken(authorization)
        let list = await ApplyList.find({
            receiverId: id
        })
        ctx.body = {
            code: 200,
            message: '查找成功',
            data: list
        }
        return
    }
    // 增加好友
    async addFrinds(ctx) {
        ctx.status = 200;
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        ctx.verifyParams({
            id: {
                type: 'string', required: true
            }
        })
        const { id } = ctx.request.body;
        let user = await User.findOne({
            id: id
        });
        if (!user) {
            ctx.body = {
                code: 400,
                message: '没有该用户',
                data: {}
            }
            return;
        }
        await User.updateOne({
            id: authData.id,
        }, {
            $addToSet: { friends: user.id }
        })
        ctx.body = {
            code: 200,
            message: '添加成功',
            data: {}
        }
        return
    }
    // 获取用户的好友列表
    async getFrindsList(ctx) {
        ctx.status = 200;
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        let { friends } = await User.findOne({
            id: authData.id
        });
        let friendsList = await User.find({
            $or: friends.map(item => ({ "id": item }))
        })
        ctx.body = {
            code: 200,
            message: '成功获取好友列表',
            data: {
                friendsList: pySegSort(friendsList.map((item) => {
                    return {
                        id: item.id,
                        userName: item.userName,
                        headImg: item.headImg,
                        intro: item.intro
                    }
                })),
                total: friendsList.length
            }
        }
        return

    }
    // 获取自己的用户信息
    async getUserInfo(ctx) {
        ctx.status = 200;
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        let user = await User.findOne({
            id: authData.id
        })
        if (!user) {
            ctx.body = {
                code: 400,
                message: '没有该用户',
                data: {}
            }
            return;
        }
        ctx.body = {
            code: 200,
            message: '成功',
            data: {
                userInfo: {
                    id: user.id,
                    userName: user.userName,
                    sex: user.sex,
                    headImg: user.headImg,
                    intro: user.intro
                }
            }
        }
        return
    }
}

module.exports = new UserCtl();