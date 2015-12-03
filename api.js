var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var db_name = "plask";

var url = 'mongodb://127.0.0.1:27017/' + db_name;

module.exports = (function() {
    'use strict';
    var api = express.Router()
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("error connecting to DB");
	    //db.sendStatus(404);
            throw err;
        }
        else
        {
            api.get("/getposts", function(req, res) {
                db.collection("posts", function(err, coll) {
                    coll.find({}, function(err, cursor) {
                        cursor.toArray(function(err, docs) {
			    if (docs) {
				res.send(docs);
			    }
			    else {
				res.sendStatus(404);
			    }
                        });
                    });
                });
            });

            api.get("/:search", function(req, res) {
                db.collection("posts", function(err, coll) {
                    coll.find({text: {$regex: req.params.search}}, function(err, cursor) {
                        cursor.toArray(function(err, docs) {
                            res.send(docs);
                        });
                    });
                });
            });

            api.post("/add", function(req, res) {
		console.log(req.body);
                db.collection("posts", function(err, coll) {
		    console.log(req.body);
		    var text = req.body.text;
		    var lat = req.body.lat;
		    var lng = req.body.lng;
		    var likes = req.body.lng;
                    coll.insert({"text":text, "lat":lat, "lng":lng, "likes":likes}, function(err, cursor) {
			if (cursor) {
                            res.sendStatus(200);
			}
			else {
			    res.sendStatus(409);
			}
		    });
		});
	    });
	}
    });
    return api;
}) ();
    
