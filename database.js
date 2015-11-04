var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/plask';

var getPosts = function(id, resCB) {
    module.exports.posts.find({}, function(err, cursor){
        cursor.toArray(function(err, docs) {
            resCB.send(docs); 
        });
    });
};

var addPost = function(id, resCB) {
    module.exports.posts.insert({text:"post"}, function(err, cursor) {
        res.sendStatus(200);
    });
};


module.exports.init = function (onErrorCB) {
    MongoClient.connect(url, function(err, db) {
        module.exports.db = db;
        db.collection('posts', function(err, coll){
          if(err) {
              onErrorCB(err);
          } else {
              module.exports.posts = coll;
              module.exports.addPost = addPost;
              module.exports.getPosts = getPosts;
              onErrorCB(err);
          }
      });
  });
};

