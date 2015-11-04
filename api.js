var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/plask';

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
