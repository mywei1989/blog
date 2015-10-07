var User = require('../models/user.js');
var Post = require('../models/post.js');

module.exports = function(app){
  app.get('/post',function(req,res){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      /*user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
          res.render('post');
        }else{
          res.redirect('/login');
        }
      });*/
      res.render('post');
    }
  });

  app.post('/post',function(req,res){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      /*user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
        }else{
          res.redirect('/login');
        }
      });*/

      var formData = req.body;
      var date = new Date(formData.date);
      console.log(formData);

      var post = new Post(
        formData.name,
        formData.title,
        date,
        formData.tags,
        formData.post
      );

      post.save(function(err){
        if(err===null){
          console.log('提交成功');
        }else{
          console.log('提交失败');
        }
      });

      res.redirect('/post');
    }
  });


};