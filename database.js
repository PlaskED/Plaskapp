var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/plask';

var getAll = function(resCB) {
    module.exports.posts.find({}, function(err, cursor){
        cursor.toArray(function(err, docs) {
            resCB(docs); 
        });
    });
};

var getPopular = function(resCB) {
    module.exports.posts.find({ $query: {}, $orderby: { likes : -1 } }, function(err,cursor) {
	cursor.limit(10).toArray(function(err,docs) {
	    resCB(docs);
	});
    });
};

var getPost = function(id, resCB) {
    getAll(function(docs) {
	console.log(docs.length);
	if (id > docs.length) {
	    id = 1;
	}
	module.exports.posts.find({pid:id}, function(err,cursor) {
	    cursor.limit(1).toArray(function(err, doc) {
		resCB(doc);
	    });
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
	var newLikes = likes+1;
	module.exports.posts.update({"pid": pid}, {$set: {"likes": newLikes}});
    }
    else if (op == "down") {
	var newLikes = likes-1;
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
		module.exports.getAll = getAll;
		module.exports.getPopular = getPopular;
		module.exports.getPost = getPost;
		module.exports.addPost = addPost;
		module.exports.ratePost = ratePost;
		module.exports.generateID = generatePID;
		onErrorCB(err);
            }
	});
    });
};

