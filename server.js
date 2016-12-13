var express = require('express');
var app = express();
var api = require('./api');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', api);

var server_port = 3000;
//var server_ip_address = '128.199.43.215'; // '127.0.0.1'
var server_ip_address = '127.0.0.1';

 
var server = app.listen(server_port, server_ip_address, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log( "Listening on " + server_ip_address + ", server_port " + port )
});

module.exports.server = server;
