const Router = require('koa-router');
const File = require('../../controller/file')
const fileRouter = new Router();
const multer = require('koa-multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'app/uploads/images/')
    },
    filename: function(req, file, cb){
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

var upload = multer({
    storage: storage
});

fileRouter
.post('/upload', upload.single('file'),  File.upload)


module.exports = fileRouter