
const User = require('../app/model/user')
function getUserInfo(id){
    return User.findOne({
        id: id
    });
}

let messageIndex = 0;

function createMessage(type, user, data){
    messageIndex++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    })
}


module.exports = {
    getUserInfo,
    createMessage
}