const mongoose = require('mongoose');
const MongoDB = require('./config') // 获取mongodb的配置信息

mongoose.connect(MongoDB.DB_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}, (err, client) => {
    if(err){
        console.log("MongoDB connect failed!");
    }else{
        console.log("MongoDB connect success!")
    }
})

module.exports = mongoose;