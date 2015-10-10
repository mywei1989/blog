var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');

function Article(name){
  this.name = name;
};

Article.prototype.get = function(callback){
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

module.exports = Article;