var express = require('express');
var app = express();
var api = require('./api');

app.use('/api', api);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
});

module.exports.server = server;
