const { db } = require('../model/moments');
const Moments = require('../model/moments')
const utils = require('../util/index')

class MomentsCtl {
    async create(ctx){
        ctx.status == 200;
        // 对参数进行验证
        ctx.verifyParams({
            content: {
                type: 'string', required: true
            },
            imageList: {
                type: 'array', required: false
            }
        })
        const { content, imageList } = ctx.request.body;
        if(content.trim() == ''){
            ctx.body = {
                code: 400,
                message: '内容不能为空！',
                data: {}
            }
            return ;
        }
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        var newMoments = Moments({
            userId: authData.id,
            content: content,
            imageList: imageList
        });
        await newMoments.save();
        ctx.body = {
            code: 200,
            massage: '发表成功',
            data: {}
        }
    }
    async get(ctx){
        ctx.status = 200;
        ctx.verifyParams({
            pageNo: {
                type: 'string', required: true
            },
            pageSize: {
                type: 'string', required: true
            }
        })
        const { pageNo, pageSize } = ctx.request.query;
        let momentsList = await Moments.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'id',
                    as: 'info'
                }
            }
        ]).skip((pageNo-1)*pageSize).limit(Number(pageSize))
        let total = await Moments.countDocuments();
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        ctx.body = {
            code: 200,
            message: '查询成功',
            data: {
                list: momentsList.reverse().map((item) => {
                    return {
                        _id: item._id,
                        userName: item.info[0].userName,
                        headImg: item.info[0].headImg,
                        content: item.content,
                        imageList: item.imageList,
                        like: item.likeUserId.includes(authData.id),
                        publishTime: item.publishTime
                    }
                } ),
                total: total
            }
        }
        return;
    }
    async likes(ctx){
        ctx.status = 200;
        ctx.verifyParams({
            id: {
                type: 'string', required: true
            },
            // 1是点赞 0是取消点赞
            type: {
                type: 'number', requied: true
            }
        })
        const { id, type } = ctx.request.body;
        let moment = await Moments.findOne({
            _id: id
        });
        if(!moment){
            ctx.body = {
                code: 400,
                message: '没有该动态',
                data: {}
            }
            return;
        }
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        if((type == 1 && moment.likeUserId.includes(authData.id)) || (type == 0 && !moment.likeUserId.includes(authData.id)) ){
            ctx.body = {
                code: 400,
                message: '请不要重复操作',
                data: {}
            }
            return;
        }
        if(type == 1){
            await Moments.updateOne({
                _id: id,
            },{
                $set: {
                    'likeUserId': [...new Set(moment.likeUserId).add(authData.id)]
                }
            })
            ctx.body = {
                code: 200,
                message: '点赞成功',
                data: {}
            }
            return
        }else if(type == 0){
            moment.likeUserId.splice(moment.likeUserId.findIndex(item => item == authData.id), 1)
            await Moments.updateOne({
                _id: id,
            },{
                $set: {
                    'likeUserId': moment.likeUserId
                }
            })
            ctx.body = {
                code: 200,
                message: '取消点赞成功',
                data: {}
            }
            return
        }
    }
    async comment(ctx){
        ctx.status = 200
        ctx.verifyParams({
            id: { type: 'string', required: true },
            content: { type: 'string', require: true }
        })
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        const { id, content } = ctx.request.body;
        let moment = Moments.findOne({
            _id: id
        })
        if(!moment){
            ctx.body = {
                code: 400,
                message: '没有该动态',
                data: {}
            }
            return ;
        }else {
            await Moments.updateOne({
                _id: id
            },{
                $push: { commentList: {
                    content: content,
                    userId: authData.id
                } }
            })
            ctx.body = {
                code: 200,
                message: '评论成功',
                data: {}
            }
            return
        }

    }
}

module.exports = new MomentsCtl();