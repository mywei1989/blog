var async = require('async');
var settings = require('../settings/settings.js');
var User = require('../models/user.js');
var List = require('../models/list.js');
var Post = require('../models/post.js');
var Info = require('../models/info.js');

module.exports = function(app){
  //关于 简历 链接 书单 碎语
  app.get('/:info(about|profile|links|booklist|tweets)?',function(req,res,next){
    if(req.sessionID){
      var list = new List({});
      var post = new Post({});
      var info = new Info({
        queryObj:{"name":req.params.info}
      });

      async.parallel({
        getAllTag:function(done){
          post.getAllTag(function(err,docs){
            if(!(err)&&docs){
              done(null,docs);
            }
          });
        },
        getArchive:function(done){
          list.getArchive(function(err,archiveArray){
            done(null,archiveArray);
          });
        },
        getArticle:function(done){
          info.get(function(err,doc){
            if(!(err)&&doc){
              done(null,doc);
            }else{
              //done(404);
              done(null,doc);
            }
          });
        }
      },function(asyncErr,asyncResult){
        if(!asyncErr){
          res.render('article',{
            article:asyncResult.getArticle,
            archiveList:asyncResult.getArchive,
            tags:asyncResult.getAllTag
          });
        }else{
          //404
          res.send('404');
          res.end();
        }
      });
    }
  });

  app.get('/:info(about|profile|links|booklist|tweets)?/add',function(req,res,next){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
          var info = new Info({
            queryObj:{"name":req.params.info}
          });
          info.getCount(function(err,count){
            if(!(err)&&count==0){
              var list = new List({});
              var post = new Post({});
              async.parallel({
                getAllTag:function(done){
                  post.getAllTag(function(err,docs){
                    if(!(err)&&docs){
                      done(null,docs);
                    }else{
                      done(null);
                    }
                  });
                },
                getArchive:function(done){
                  list.getArchive(function(err,archiveArray){
                    if(!(err)&&archiveArray){
                      done(null,archiveArray);
                    }else{
                      done(null);
                    }
                  });
                },
              },function(asyncErr,asyncResult){
                res.render('post',{
                  tags:asyncResult.getAllTag,
                  archiveList:asyncResult.getArchive
                });
              });
            }else{
              res.redirect(301,'/'+req.params.info);
            }
          });
        }else{
          res.redirect('/login');
        }
      });
    }
  });
  app.post('/:info(about|profile|links|booklist|tweets)?/add',function(req,res,next){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
          var formData = req.body;
          var date = new Date(formData.date);
          var info = new Info({
            queryObj:{name:req.params.info},
            name:formData.name,
            title:formData.title,
            date:date,
            post:formData.post
          });
          info.save(function(err){
            if(!(err)){
              res.redirect('/'+req.params.info+'/edit');
            }
          });
        }else{
          res.redirect('/login');
        }
      });
    }
  });
  app.get('/:info(about|profile|links|booklist|tweets)?/edit',function(req,res,next){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
          var list = new List({});
          var post = new Post({});
          var info = new Info({
            queryObj:{"name":req.params.info}
          });

          async.parallel({
            getAllTag:function(done){
              post.getAllTag(function(err,docs){
                if(!(err)&&docs){
                  done(null,docs);
                }
              });
            },
            getArchive:function(done){
              list.getArchive(function(err,archiveArray){
                done(null,archiveArray);
              });
            },
            getArticle:function(done){
              info.getEdit(function(err,doc){
                if(!(err)&&doc){
                  done(null,doc);
                }else{
                  //done(404);
                  done(null,doc);
                }
              });
            }
          },function(asyncErr,asyncResult){
            if(!asyncErr){
              res.render('post',{
                article:asyncResult.getArticle,
                archiveList:asyncResult.getArchive,
                tags:asyncResult.getAllTag
              });
            }else{
              //404
              res.send('404');
              res.end();
            }
          });
        }else{
          res.redirect('/login');
        }
      });
    }
  });
  app.post('/:info(about|profile|links|booklist|tweets)?/edit',function(req,res,next){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
          var formData = req.body;
          var date = new Date(formData.date);
          var info = new Info({
            queryObj:{name:req.params.info},
            name:formData.name,
            title:formData.title,
            date:date,
            post:formData.post
          });
          info.save(function(err){
            if(err===null){
              res.redirect('/'+req.params.info+'/edit');
            }
          });
        }else{
          res.redirect('/login');
        }
      });
    }
  });
};