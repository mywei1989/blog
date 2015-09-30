var settings = require('../settings/settings.js');
var MongoClient = require('../models/db');

module.exports = function(app){
  app.get('/login',function(req,res){
    if(req.sessionID){
      res.render('login');
    }else{
      res.end();
    }
  });

  app.post('/login',function(req,res){
    var user = req.body;
    console.log(user);
    MongoClient.connect(settings.mongoUrl,function(err,db){
      var collection = db.collection('users');
      collection.insert({
        userName:user.userName,
        userPassword:user.userPassword
      },function(err,result){
        console.log(result);
        db.close();
      });

    });
    res.redirect('/login');

  });

};