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
            api.get("/getposts", function(req, res) {
		database.getPosts(function(result){
                    result.reverse();
                    res.send(result);
                });
            });

            api.post("/add", function(req, res) {
		console.log(req.body);
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
		console.log(req.body);
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

