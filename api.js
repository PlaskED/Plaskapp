var express = require('express');
var database = require('./database');
//var url = 'mongodb://127.0.0.1:27017/' + db_name;

module.exports = (function() {
    'use strict';
    var api = express.Router()
    database.init(function(err) {
        if (err) {
            throw err;
        } else {
            api.get("/getall", function(req, res) {
		database.getAll(function(result){
                    result.reverse();
                    res.send(result);
                });
            });

	    api.get("/getlocal", function(req, res) {
		var coords = [req.body.lng, req.body.lat];
		console.log(coords);
		database.getLocal(coords, function(result){
                    res.send(result);
                });
            });

	    api.get("/getpost/:id", function(req, res) {
		var pid = parseInt(req.params.id);
		database.getPost(pid, function(result){
                    res.send(result);
                });
            });

	    api.get("/popular", function(req, res) {
		database.getPopular(function(result){
                    res.send(result);
                });
            });

            api.post("/add", function(req, res) {
		var text = req.body.text;
		var lat = req.body.lat;
		var lng = req.body.lng;
		var likes = 0;
		database.addPost(text, lat, lng, likes, function(err, doc) {
                    if (err) {
                        res.sendStatus(409);
                    }
		    else {
			res.sendStatus(200);
		    }
		});
	    });

	    api.post("/rate", function(req, res) {
		var pid = req.body.pid;
		var likes = req.body.likes;
		var op = req.body.op;
		database.ratePost(pid, likes, op, function(err, doc) {
                    if (err) {
                        res.sendStatus(409);
                    }
		    else {
			res.sendStatus(200);
		    }
		});
	    });
	}
    });
    return api;
}) ();

