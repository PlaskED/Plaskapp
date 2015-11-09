var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var db_name = "plask";

mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}

var url = mongodb_connection_string; //more readable

module.exports = (function() {
    'use strict';
    var api = express.Router()
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("error connecting to DB");
            throw err;
        }
        else
        {
            api.get("/getposts", function(req, res) {
                db.collection("posts", function(err, coll) {
                    coll.find({}, function(err, cursor) {
                        cursor.toArray(function(err, docs) {
                            res.send(docs);
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

            api.get("/add/:post", function(req, res) { //ändra till post senare
                db.collection("posts", function(err, coll) {
                    coll.insert({text:req.params.post}, function(err, cursor) {
                        res.sendStatus(200);
                    });       
                });
            });
        }
    });
                
    return api;
}) ();
