var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');


function User(user){
  this.userName = user.userName;
  this.userPassword = user.userPassword;
  this.sessionID = user.sessionID
}



User.prototype.login = function(callback){
  var that = this;
  var user = {
    userName:this.userName,
    userPassword:this.userPassword
  };
  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('users');
      collection.findOne({userName:user.userName,userPassword:user.userPassword},function(err,result){
        if((!err)&&result){
          callback&&callback(true);
        }else{
          callback&&callback(false);
        }
        db.close();
      });
    }else{
      return callback&&callback(err);
    }
  });
};

User.prototype.saveCookie = function(callback){
  var user = {
    sessionID:this.sessionID
  };
  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('usercookie');
      collection.insert({
        sessionID:user.sessionID
      },function(err,result){
        if((!err)&&result){
          callback&&callback(true);
        }else{
          callback&&callback(false);
        }
        db.close();
      });
    }else{
      return callback&&callback(err);
    }
  });
};

User.prototype.checkLogin = function(callback){
  var that = this;
  var user = {
    sessionID:this.sessionID
  };

  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('usercookie');
      collection.findOne({sessionID:user.sessionID},function(err,usercookieinfo){
        db.close();
        if((!err)&&usercookieinfo){
          callback(null,usercookieinfo);
        }else{
          callback&&callback(err);
        }
      });
    }else{
      return callback&&callback(err);
    }
  });
};

User.prototype.register = function(callback){
  var user = {
    userName:this.userName,
    userPassword:this.userPassword
  };

  MongoClient.connect(settings.mongoUrl,function(err,db){
    if(!err){
      var collection = db.collection('users');
      collection.insert({
        userName:user.userName,
        userPassword:user.userPassword
      },function(err,result){
        db.close();
      });
    }else{
      return callback&&callback(err);
    }

  });
};

module.exports = User;