const WebSocket = require('ws'); // 引入WebSocket模块
const WebSocketServer = WebSocket.Server; // 引用Server类
const url = require('url')
const { createMessage, getUserInfo } = require('./getUser');
const { 
    saveOfflineMessage, getOfflineMessageById, 
    delOfflineMessageById, saveChatRecord } = require('./saveMessage');
const jsonwebtoken = require('jsonwebtoken');
const secret = require('../config').secret

let wsObj = {};

function createWebSocketServer(server, onConnection, onMessage, onClose, onError){
    // 创建一个wss实例
    let wss = new WebSocketServer({
        server: server
    })

    // 自定义广播方法
    wss.broadcast = function broadcast(data){
        wss.clients.forEach((client) => {
            client.send(data)
        })
    }

    onConnection = onConnection || function(){
        console.log("[WebSocket] connected!")
    }
    
    onMessage = onMessage || function(msg){
        console.log("[WebSocket] message received" + msg)
    }

    onClose = onClose || function(code, message){
        console.log(`[WebSocket] closed: ${code} - ${message}`)
    }

    onError = onError || function(err){
        console.log("[WebSocket] error" + err)
    }

    wss.on('connection', async (ws, req) => {
        ws.upgradeReq = req;
        let token = req.headers['sec-websocket-protocol'] || ''
        let authData = jsonwebtoken.verify(token, secret, (err, data) => {
            if(err != null){
                return null
            }else {
                return data
            }
        })
        let location = url.parse(ws.upgradeReq.url, true)
        console.log("[WebSocket] connection:" + location.href);
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);

        if(location.pathname !== '/ws/chat' || authData == null){
            // 关闭ws
            console.log("关闭websocket")
            ws.close(4000, 'Invalid URL Or Error Token');
        }
        let user = await getUserInfo(authData.id || '');
        ws.user = user;
        ws.wss = wss;
        onConnection.apply(ws);
        console.log(authData);
        wsObj[authData.id] = ws;
        // let user = getIdByToken(ws.upgradeReq.headers.)
    })
    return wss;
}

async function onConnect(){
    console.log("监听onConnect")
    let user = this.user;
    let msg = createMessage('join', user, `${user.name} joined.`);
    this.wss.broadcast(msg);

    let users = this.wss.clients.forEach((client) => {
        return client.user;
    })
    let result = await getOfflineMessageById(this.user.id);
    console.log('该用户的离线消息', result.length)
    result.forEach(item => {
        let msg = createMessage('chat', { id: item.senderId }, item.content.trim())
        this.send(msg)
    });
    if(result.length !== 0) await delOfflineMessageById(this.user.id)
    this.send(createMessage('list', user, users), (err) => {
        if(err) console.log("发送消息发生了错误", err);
    });
    console.log('数量', this.wss.clients.size)
}   

async function onMessage(messageObj){
    let { id, message } = JSON.parse(messageObj);
    console.log('message', message)
    if(message && message.trim()){
        let msg = createMessage('chat', this.user, message.trim());
        saveChatRecord(this.user.id, id, this.user.id, 1, message)
        if(wsObj.hasOwnProperty(id)){
            wsObj[id].send(msg)
        } 
        else {
            saveOfflineMessage(this.user.id, id, 1, message)
            console.log("该用户没有上线！")
        }
        
    }
}

function onClose(){
    let user = this.user;
    let msg = createMessage('leave', user, `${user.name} is left`);
    this.wss.broadcast(msg);
}

module.exports = function(server){
    return createWebSocketServer(server, onConnect, onMessage, onClose)
}

