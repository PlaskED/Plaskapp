var express = require('express');
var app = express();
var api = require('./api');

app.use('/api', api);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
var server = app.listen(server_port, server_ip_address, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log( "Listening on " + server_ip_address + ", server_port " + port )
});

module.exports.server = server;
