var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');

function List(pageIndex,pageSize,queryObj){
  this.pageIndex = pageIndex;
  this.pageSize = pageSize;
  //this.tag = tag;
  this.query = queryObj
}

//读取数据量
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

//读取列表
List.prototype.getList = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    var collection = db.collection('posts');
    var skip = that.pageIndex==1?0:(that.pageIndex-1)*3;
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

//读取归档
List.prototype.getArchive = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    var collection = db.collection('posts');

    collection.aggregate([{
      $group:{
        _id:{
          year:{$year:"$time.date"}
        },
        count:{$sum:1}
      }
    }],function(err,result){
      db.close();
      /*console.log('err:'+err);
      console.log('result:'+result[0]);*/
      var temp = result[1];
      for(var i in temp){
        if(typeof(temp[i])=="function"){
          temp[i]();
         }else{
          console.log(temp[i]);
        }
      }

      if(err){
        return callback&&callback(err);
      }
      callback&&callback(null,result);
    });

    /*collection.find(that.query,function(err,count){
      if(err){
        return callback&&callback(err);
      }
      callback&&callback(null,count);
      db.close();
    });*/
  });
};

module.exports = List;