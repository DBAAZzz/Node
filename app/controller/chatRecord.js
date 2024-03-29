const ChatRecord = require('../model/chatRecord')
const utils = require('../util/index')

class ChatRecordCtl{
    /* 根据用户id获取跟该用户的聊天记录 */
    async getRecord(ctx){
        ctx.status = 200
        ctx.verifyParams({
            id: {
                type: 'string', required: true
            }
        })

        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        const { id } = ctx.request.query;
        let list = await ChatRecord.find({
            '$or': [
                {'$and': [{'senderId': authData.id}, {'receiverId': id}]},
                {'$and': [{'senderId': id}, {'receiverId': authData.id}]}
            ]
        }).sort({'time': 1})
        ctx.body = {
            code: 200,
            message: '成功获取到数据',
            data: {
                list: list.map((item) => {
                    return {
                        identity: item.senderId == authData.id ? 1 : 0,
                        type: item.type,
                        content: item.content,
                        time: item.time
                    }
                })
            }
        }
        return ;
    }
    /* 获取聊过天的用户列表和最后一条聊天记录 */ 
    async getChatList(ctx){
        ctx.status = 200;
        const { authorization } = ctx.request.header;
        let authData = utils.getIdByToken(authorization)
        let list = await ChatRecord.aggregate([
            {
                $match: {
                    senderId: authData.id
                }
            },
            {
                $group: {
                    _id: '$receiverId',
                    time: {
                        $max: "$time"
                    },
                    receiverId:{
                        $first: '$receiverId'
                    },  
                    content: {
                        $last: '$content'
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'receiverId',
                    foreignField: 'id',
                    as: 'info'
                }
            }
        ])
        ctx.body = {
            code: 200,
            message: '成功获取到数据',
            data: {
                list: list.map(item => {
                    return {
                        id: item.receiverId,
                        userName: item.info[0].userName,
                        headImg: item.info[0].headImg,
                        content: item.content,
                        time: item.time,
                        
                    }
                })
            }
        }
        return ;
    }
}

module.exports = new ChatRecordCtl();