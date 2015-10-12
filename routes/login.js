var settings = require('../settings/settings.js');
/*var MongoClient = require('../models/db');*/
var User = require('../models/user.js');

module.exports = function(app){
  app.get('/login',function(req,res){
    if(req.sessionID){
      //res.render('login');
      var user = new User({
        sessionID:req.sessionID
      });
      user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
          res.redirect('back');
        }else{
          res.render('login');
        }
      });
    }else{
      res.end();
    }
  });

  app.post('/login',function(req,res){
    if(req.sessionID){
      var loginForm = req.body;
      var userLogin = new User({
        userName: loginForm.userName,
        userPassword: loginForm.userPassword,
        sessionID:req.sessionID
      });
      userLogin.login(function(result){
        if(result){
          userLogin.saveCookie(function(result){
            if(result){
              console.log('登录成功');
              res.redirect('/about/edit');
            }else{

            }
          });
        }else{
          console.log('登录失败');
          res.redirect('/login');
        }
      });
    }

  });

  /*app.post('/register',function(req,res){
    var loginForm = req.body;
    var userLogin = new User({
      userName: loginForm.userName,
      userPassword: loginForm.userPassword
    });
    userLogin.register(function(result){
      if(result){
        console.log('注册成功');
      }else{
        console.log('注册失败');
      }
    });

    res.redirect('/login');
  });*/

};