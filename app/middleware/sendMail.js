const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

module.exports = sendEmail => {
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
            code += parseInt(Math.random() * 10)
        }
        return code 
    }

    const regEmail=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //验证邮箱正则

    return async(ctx) => {
        
        console.log(ctx)
        const { email } = ctx.request.body
        let EMAIL = email;
        if (regEmail.test(EMAIL)){
            let code = randomFns()
            transport.sendMail({
                from: 'newflag@foxmail.com', // 发件邮箱
                to: EMAIL, // 收件列表
                subject: '验证你的电子邮件', // 标题
                html: `
                    <p>你好！</p>
                    <p>您正在注册DBAA社区账号</p>
                    <p>${Date.now()}</p>
                    <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>` // html 内容
            }, 
            (error, data) => {
                if(error){
                    // 如果没用，关闭连接池
                    transport.close(); 
                    return ;
                }
            })        
            ctx.body = {
                code: 200,
                message: '发送成功',
                data: {}
            }
        }else{
            ctx.body = {
                code: 200,
                message: '请输入正确的邮箱格式！',
                data: {}
            }
        }
    }
}