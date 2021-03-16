var md5 = require('md5');
const jsonwebtoken = require('jsonwebtoken');
const secret = require('../../config').secret

var MD5 = function(val,solt){
    return new Promise((resolve, reject)=>{
      var passSolt = md5(md5(val)+solt);
      resolve(passSolt );
    })
}

var getIdByToken = function(authorization){
    let token = authorization.split(' ')[1];
    let authData = jsonwebtoken.verify(token, secret)
    return authData;
}

module.exports = {
    MD5, 
    getIdByToken
}