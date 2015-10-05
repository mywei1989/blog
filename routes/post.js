var User = require('../models/user.js');

module.exports = function(app){
  app.get('/post',function(req,res){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      user.checkLogin(function(result){
        if(result){
          res.render('post');
        }else{
          res.redirect('/login');
        }
      });
    }
  });

  app.post('/post',function(req,res){

  });


};