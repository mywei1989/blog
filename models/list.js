var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');

function List(pageIndex,pageSize,tag){
  this.pageIndex = pageIndex;
  this.pageSize = pageSize;
  this.tag = tag;
}

List.prototype.getList = function(callback){
  MongoClient.connect(settings.mongoUrl,function(err,db){
    var collection = db.collection('posts');
    collection.find({})
      .skip(1)
      .limit(10000)
      .sort({time:-1})
      .toArray(function(err,docs){
        if(err){
          return callback&&callback(err);
        }
        callback&&callback(null,docs);
        db.close();
    });
  });
};

List.prototype.getCount = function(callback){
  MongoClient.connect(settings.mongoUrl,function(err,db){
    var collection = db.collection('posts');
    collection.count(function(err,count){
      if(err){
        return callback&&callback(err);
      }
      callback&&callback(null,count);
      db.close();
    });
  });
};

module.exports = List;