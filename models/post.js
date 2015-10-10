var markdown = require('markdown').markdown;
var marked = require('marked');
marked.setOptions({
  highlight:function(code){
    return require('highlight.js').highlightAuto(code).value;;
  }
});
var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');

function Post(post){
  this.name = post.name;
  this.title = post.title;
  this.date = post.date;
  this.tags = post.tags;
  this.post = post.post;
  this.query = post.queryObj;
}

Post.prototype.getAllTag = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
    var collection = db.collection('posts');
    collection.distinct('tags',function(err,docs){
      db.close();
      if(err){
        return callback&&callback(err);
      }
      callback&&callback(null,docs);
    });
  });
};

Post.prototype.save = function(callback){
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

  var post = {
    name:this.name,
    title:this.title,
    time:time,
    tags:this.tags,
    post:this.post
  };

  MongoClient.connect(settings.mongoUrl,function(err,db){
    var collection = db.collection('posts');
    collection.insert(post,function(err){
      db.close();
      if(err){
        return callback&&callback(err);
      }
      callback&&callback(null);
    });
  });
};

Post.prototype.getArticle = function(callback){
  var that = this;
  MongoClient.connect(settings.mongoUrl,function(err,db){
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
  });
};



module.exports = Post;