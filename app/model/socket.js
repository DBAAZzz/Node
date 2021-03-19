const mongoose = require('mongoose');

var SocketSchema = new mongoose.Schema({})

var Socket = mongoose.model('Socket', SocketSchema);

module.exports = Socket