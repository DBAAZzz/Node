
const OfflineMessage = require('../app/model/offlineMessage')
const ChatRecord = require('../app/model/chatRecord')

async function saveChatRecord(senderId, receiverId,talker = null, type, content){
    var newChat = ChatRecord({
        senderId: senderId,
        receiverId: receiverId,
        talker: talker || senderId,
        time: +new Date(),
        type: type,
        content: content
    })
    await newChat.save();
}

async function saveOfflineMessage(senderId, receiverId, type, content){
    var newOfflineMessage = OfflineMessage({
        senderId: senderId,
        receiverId: receiverId,
        time: +new Date(),
        type: type,
        content: content
    });
    await newOfflineMessage.save();
}

async function getOfflineMessageById(id){
    return await OfflineMessage.find({
        receiverId: id
    });
}


async function delOfflineMessageById(id){
    return await OfflineMessage.remove({
        receiverId: id
    })
}




module.exports = {
    saveOfflineMessage,
    getOfflineMessageById,
    delOfflineMessageById,
    saveChatRecord
}