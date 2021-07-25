class FileCtl{
    async upload(ctx){
        ctx.body = {
            code: 200,
            message: '上传成功',
            data: `http://139.196.100.226/images/${ctx.req.file.filename}`  //返回文件名
        }
    }
}

module.exports = new FileCtl();