var settings = require('../settings/settings.js');
/*var MongoClient = require('../models/db');*/
var User = require('../models/user.js');

module.exports = function(app){
  app.get('/login',function(req,res){
    if(req.sessionID){
      res.render('login');
    }else{
      res.end();
    }
  });

  app.post('/login',function(req,res){
    var loginForm = req.body;
    var userLogin = new User({
      userName: loginForm.userName,
      userPassword: loginForm.userPassword
    });
    userLogin.login(function(result){
      if(result){
        console.log('登录成功');
      }else{
        console.log('登录失败');
      }
    });

    res.redirect('/login');

  });

};