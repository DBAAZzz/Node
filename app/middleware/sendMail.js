const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

module.exports = sendEmail => {
    console.log("????")
    // 创建连接对象
    const transport = nodemailer.createTransport(smtpTransport({
        host: 'smtp.qq.com', // 服务 由于我用的163邮箱
        port: 587, // smtp端口 默认无需改动
        secureConnection: false, // use SSL
        auth: {
            user: '2032229718@qq.com', // 用户名
            pass: 'iwcvpgdvqsundjbd' // SMTP授权码
        }
    }));

    const randomFns = () => { // 生成6位随机数
        let code = ""
        for(let i = 0; i < 6; i++){
            code += parseInt(Math.random()*10)
        }
        return code 
    }

    const regEmail=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //验证邮箱正则

    return async(req,res,next)=>{
        let EMAIL = '1292094030@qq.com'
        if (regEmail.test(EMAIL)){
          let code = randomFns()
          transport.sendMail({
            from: '2032229718@qq.com', // 发件邮箱
            to: EMAIL, // 收件列表
            subject: '验证你的电子邮件', // 标题
            html: `
            <p>你好！</p>
            <p>您正在注册Cracker社区账号</p>
            <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
            <p>***该验证码5分钟内有效***</p>` // html 内容
          }, 
          function(error, data) {
            console.log(error)
            if(error){
                return console.log(error);
            }
            console.log('Message send: %s', data.messageId);
            // transport.close(); // 如果没用，关闭连接池
          })        
        }else{
            console.log("请输入正确的邮箱格式！")
        }
    }
}