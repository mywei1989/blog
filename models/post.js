var marked = require('marked');
marked.setOptions({
  breaks: true,
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
    if(!err){
      var collection = db.collection('posts');
      collection.distinct('tags',function(err,docs){
        db.close();
        if(err){
          return callback&&callback(err);
        }
        callback&&callback(null,docs);
      });
    }else{
      return callback&&callback(err);
    }
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
    if(!err){
      var collection = db.collection('posts');
      collection.insert(post,function(err){
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

Post.prototype.update = function(callback){
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

  var post = {
    name:this.name,
    title:this.title,
    time:time,
    tags:this.tags,
    post:this.post
  };

  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('posts');
      collection.findOneAndUpdate(that.query,post,{},function(err){
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

module.exports = Post;