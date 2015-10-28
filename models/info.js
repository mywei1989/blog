var marked = require('marked');
marked.setOptions({
  breaks: true,
  highlight:function(code){
    return require('highlight.js').highlightAuto(code).value;;
  }
});
var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');

function Info(info){
  this.name = info.name;
  this.title = info.title;
  this.date = info.date;
  this.query = info.queryObj;
  this.post = info.post;
};

Info.prototype.get = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('info');
      //{"time.year":2015,"time.month":10,"name":"testroute10"}
      collection.findOne(that.query,function(err,doc){
        db.close();
        if(err){
          return callback&&callback(err);
        }else if(doc===null){
          return callback&&callback(404);
        }else{
          doc.timeStr = doc.time.year+'年'+doc.time.month+'月'+doc.time.day+'日';
          doc.post = marked(doc.post);
          return callback&&callback(null,doc);
        }
      });
    }else{
      return callback&&callback(err);
    }  });
};

Info.prototype.getEdit = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('info');
      //{"time.year":2015,"time.month":10,"name":"testroute10"}
      collection.findOne(that.query,function(err,doc){
        db.close();
        if(err){
          return callback&&callback(err);
        }else if(doc===null){
          return callback&&callback(404);
        }else{
          doc.timeStr = doc.time.year+'年'+doc.time.month+'月'+doc.time.day+'日';
          //doc.post = marked(doc.post);
          return callback&&callback(null,doc);
        }
      });
    }else{
      return callback&&callback(err);
    }
  });
};

Info.prototype.getCount = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('info');
      collection.count(that.query,function(err,count){
        db.close();
        if(err){
          return callback&&callback(err);
        }
        callback&&callback(null,count);
      });
    }else{
      return callback&&callback(err);
    }

  });
};

Info.prototype.save = function(callback){
  var that = this;
  var time = {
    date:this.date,
    year: this.date.getFullYear(),
    month:this.date.getMonth()+1,
    monthQuery: this.date.getFullYear()+'-'+(this.date.getMonth()+1),
    day:this.date.getDate(),
    dayQuery: this.date.getFullYear()+'-'+(this.date.getMonth()+1)+'-'+this.date.getDate(),
    minute: this.date.getFullYear()+'-'+(this.date.getMonth()+1)+'-'+this.date.getDate()+' '
            +this.date.getHours()+':'+(this.date.getMinutes()<10?'0'+this.date.getMinutes():this.date.getMinutes())
  };

  var info = {
    name:this.name,
    title:this.title,
    time:time,
    post:this.post
  };

  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('info');
      //{name:"about"}
      collection.findOneAndUpdate(that.query,info,{upsert:true},function(err,result){
        db.close();
        if(err){
          return callback&&callback(err);
        }
        callback&&callback(null);
      });
    }else{
      return callback&&callback(err);
    }
  });
};

module.exports = Info;