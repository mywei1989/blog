var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');

function List(pageIndex,pageSize,queryObj){
  this.pageIndex = pageIndex;
  this.pageSize = pageSize;
  //this.tag = tag;
  this.query = queryObj
}

List.prototype.getCount = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    var collection = db.collection('posts');
    collection.count(that.query,function(err,count){
      if(err){
        return callback&&callback(err);
      }
      callback&&callback(null,count);
      db.close();
    });
  });
};

List.prototype.getList = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    var collection = db.collection('posts');
    var skip = that.pageIndex==1?0:(that.pageIndex-1)*3
    collection.find({})
      .skip(skip)
      .limit(that.pageSize)
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

module.exports = List;