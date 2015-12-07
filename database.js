var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/plask';

var getPosts = function(resCB) {
    module.exports.posts.find({}, function(err, cursor){
        cursor.toArray(function(err, docs) {
	    console.log(docs);
            resCB(docs); 
        });
    });
};


var addPost = function(text, lat, lng, likes, addCB) {
    generatePID(function (pid) {
        module.exports.posts.insert({
            text: text,
            lat: lat,
            lng: lng,
            likes: likes,
            pid: pid,
        }, function (err, doc) {
            addCB(err, doc);
	});
    });
}

var ratePost = function(pid, likes, op) {
    if (op == "up") {
	newLikes = likes+1;
	module.exports.posts.update({"pid": pid}, {$set: {"likes": newLikes}});
    }
    else if (op == "down") {
	newLikes = likes-1;
	module.exports.posts.update({"pid": pid}, {$set: {"likes": newLikes}});
    }
};;

var generatePID = function(pidCB) {
    module.exports.posts.find({}, function(err, cursor) {
        cursor.toArray(function(err, docs){
            if(!docs[0]) {
                pidCB(1);
            }
            else {
                pidCB(parseInt(docs[docs.length - 1].pid) + 1);
            }
        });
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
		module.exports.ratePost = ratePost;
		module.exports.generateID = generatePID;
		onErrorCB(err);
            }
	});
    });
};

