var express = require('express');
var database = require('./database');
var passport = require('passport');
var GoogleTokenStrategy = require('passport-google-id-token');
var GOOGLE_CLIENT_ID = "903897751193-ribbhe2r2st90dd7knapnjq2tsesfh8g.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "ffrMq77h47JF7ZjDcnt4fbsY";

module.exports = (function() {
    'use strict';
    var api = express.Router()
    database.init(function(err) {
        if (err) {
            throw err;
        } else {
	    passport.use(GoogleTokenStrategy,
		 function(parsedToken, googleId, done) {
			 User.findOrCreate({ googleId: googleId }, function (err, user) {
			     if (!err) {
				 console.log(user);
			     }
			     return done(err, user);
			  });
		 }
			);

	    api.post("/auth", function(req, res) {
		passport.authenticate("google-id-token", function(err, user) {
		    console.log(user);
		    res.send(req.user? 200 : 401);
		});
	    });

            api.get("/getall/:lpid", function(req, res) {
		var lpid = parseInt(req.params.lpid);
		database.getAll(lpid,function(result){
                    res.send(result);
                });
            });

	    api.get("/getlocal/:lng/:lat", function(req, res) {
		var coords = [parseFloat(req.params.lng), 
			      parseFloat(req.params.lat)];
		database.getLocal(coords, function(result){
		    result.reverse();
                    res.send(result);
                });
            });

	    api.get("/getpost/:id", function(req, res) {
		var pid = parseInt(req.params.id);
		database.getPost(pid, function(result){
		    result.reverse();
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
		var lat = parseFloat(req.body.lat);
		var lng = parseFloat(req.body.lng);
		var likes = 0;
		console.log(req.body);
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
		var token = req.headers.token;
		console.log(token);
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

