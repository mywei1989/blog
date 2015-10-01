var settings = require('../settings/settings.js');
var MongoClient = require('./db.js');


function User(user){
  this.userName = user.userName;
  this.userPassword = user.userPassword;
}



User.prototype.login = function(callback){
  var user = {
    userName:this.userName,
    userPassword:this.userPassword
  };

  MongoClient.connect(settings.mongoUrl,function(err,db){
      var collection = db.collection('users');
      /*collection.insert({
        userName:user.userName,
        userPassword:user.userPassword
      },function(err,result){
        console.log(result);
        db.close();
      });*/
      collection.findOne({userName:user.userName,userPassword:user.userPassword},function(err,result){
        if((!err)&&result){
          callback&&callback(true);
        }else{
          callback&&callback(false);
        }
        db.close();
      });

    });
}

module.exports = User;