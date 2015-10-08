var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');

function Post(name,title,date,tags,post){
  this.name = name;
  this.title = title;
  this.date = date;
  this.tags = tags;
  this.post = post;
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

Post.prototype.get = function(){

};



module.exports = Post;