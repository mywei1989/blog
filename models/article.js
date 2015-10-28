var marked = require('marked');
marked.setOptions({
  breaks: true,
  highlight:function(code){
    return require('highlight.js').highlightAuto(code).value;;
  }
});
var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');

function Article(article){
  this.query = article.queryObj;
};

Article.prototype.get = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('posts');
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
    }

  });
};

Article.prototype.getEdit = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('posts');
      //{"time.year":2015,"time.month":10,"name":"testroute10"}
      collection.findOne(that.query,function(err,doc){
        db.close();
        if(err){
          return callback&&callback(err);
        }else if(doc===null){
          return callback&&callback(404);
        }else{
          doc.timeStr = doc.time.year+'年'+doc.time.month+'月'+doc.time.day+'日';
          return callback&&callback(null,doc);
        }
      });
    }else{
      return callback&&callback(err);
    }


  });
};

module.exports = Article;