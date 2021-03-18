class FileCtl{
    async upload(ctx){
        ctx.body = {
            code: 200,
            message: '上传成功',
            data: ctx.req.file.filename //返回文件名
        }
    }
}

module.exports = new FileCtl();