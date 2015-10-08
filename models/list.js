var settings = require('../settings/settings.js');
var commons = require('../commons/commons.js');
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

    collection.mapReduce(
      function(){
        var key = this.time.monthQuery;
        var value = {
          count:1
        };
        emit(key,value);
      },
      function(key,values){
        var reduceVal = {count:0};
        for(var i=0;i<values.length;i++){
          reduceVal.count+=values[i].count;
        }
        return reduceVal;
      },
      {
        //out:"archiveTemp",
        out:{inline:1},
        finalize:function(key,value){
          //从key中获取信息 进行手工排序
          var keyInfoArray = key.split('-');
          var year = keyInfoArray[0];
          var month = keyInfoArray[1].length==1?'0'+keyInfoArray[1]:keyInfoArray[1];
          var dateCalc = parseInt(year+month);
          value.dateCalc = dateCalc;
          value.year = parseInt(year);
          value.month = parseInt(keyInfoArray[1]);
          return value;
        }
      },
      function(err,result){
      db.close();
      var archiveArray = [];
      for(var i=0;i<result.length;i++){
        var archiveObj = {};
        archiveObj.year = result[i].value.year;
        archiveObj.month = result[i].value.month;
        archiveObj.monthFormat = commons.formatMonth(result[i].value.month);
        archiveObj.dateCalc = result[i].value.dateCalc;
        archiveObj.count = result[i].value.count;
        archiveArray.push(archiveObj);
      }

      archiveArray = commons.sortObj(archiveArray,'dateCalc','desc');


      if(err){
        return callback&&callback(err);
      }
      callback&&callback(null,archiveArray);
    });
  });
};

module.exports = List;