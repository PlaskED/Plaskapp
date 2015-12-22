var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/plask';

var getAll = function(resCB) {
    module.exports.posts.find({}, function(err, cursor){
        cursor.toArray(function(err, docs) {
	    for (var i=0 ; i < docs.length ; i++) {
		delete docs[i].location
	    }
	    resCB(docs); 
        });
    });
};

var getLocal = function(coords, resCB) {
    module.exports.posts.find({
        location: {
            '$nearSphere': {
                '$geometry': {
                    type: "Point",
                    coordinates: [coords[0], coords[1]]
                },
                '$maxDistance': 10000
            }
        }
    }, function(err, cursor) {
	cursor.toArray(function(err, docs) {
	    if(err) {
		resCB();
	    }
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
		delete doc[0].location;
		resCB(doc);
	    });
	});
    });
};

var addPost = function(text, lat, lng, likes, addCB) {
    coords_geojson = [lng, lat];
    geojson_loc = { type : "Point", coordinates : coords_geojson };
    generatePID(function (pid) {
        module.exports.posts.insert({
            text: text,
            location: geojson_loc,
            likes: likes,
            pid: pid,
        }, function (err, doc) {
	    module.exports.posts.ensureIndex({location: "2dsphere"},  function(ind_err, ind_doc) {
		addCB(err, doc);
		
            });
	});
    });
};

var ratePost = function(pid, likes, op, rateCB) {
    if (op == "up") {
	var newLikes = likes+1;
    }
    else if (op == "down") {
	var newLikes = likes-1;
    }
    
    if (newLikes <= -3) {
	removePost(pid, function(err, removeCB) {
	    rateCB();
	});
    }
    else {
	module.exports.posts.update({"pid": pid}, {$set: {"likes": newLikes}});
	rateCB();;
    }
};

var removePost = function(pid, removeCB) {
    module.exports.posts.deleteOne({"pid":pid}, function(err, result) {
	console.log("removed: "+result);
	removeCB();
    });
};

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
		module.exports.getLocal = getLocal;
		module.exports.getPopular = getPopular;
		module.exports.getPost = getPost;
		module.exports.addPost = addPost;
		module.exports.ratePost = ratePost;
		module.exports.removePost = removePost;
		module.exports.generateID = generatePID;
		onErrorCB(err);
            }
	});
    });
};

