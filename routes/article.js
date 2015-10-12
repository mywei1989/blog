var async = require('async');
var settings = require('../settings/settings.js');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Article = require('../models/article.js');
var List = require('../models/list.js');

module.exports = function(app){
  app.get('/:year/:month/:name',function(req,res,next){
    if(req.sessionID){
      var list = new List({});
      var year = parseInt(req.params.year);
      var month = parseInt(req.params.month);
      if((!year)&&(!month)){
        res.status(404).end();
        return;
      }
      var post = new Post({

      });
      var article = new Article({
        queryObj:{"time.year":year,"time.month":month,"name":req.params.name}
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
          article.get(function(err,doc){
            if(!(err)&&doc){
              done(null,doc);
            }else{
              done(404);
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
  app.get('/:year/:month/:name/edit',function(req,res,next){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
          var list = new List({});
          var year = parseInt(req.params.year);
          var month = parseInt(req.params.month);
          if((!year)&&(!month)){
            res.status(404).end();
            return;
          }
          var post = new Post({

          });
          var article = new Article({
            queryObj:{"time.year":year,"time.month":month,"name":req.params.name}
          });

          async.auto({
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
              article.getEdit(function(err,doc){
                if(!(err)&&doc){
                  done(null,doc);
                }else{
                  //done(404);
                  done(null,doc);
                }
              });
            },
            setChooseTags:['getAllTag','getArticle',function(done,results){
              var allTags = results.getAllTag;
              var articleTags = results.getArticle.tags;
              for(var i=0;i<allTags.length;i++){
                for(var j=0;j<articleTags.length;j++){
                  if(allTags[i].tag===articleTags[j].tag){
                    allTags[i].checked = "checked";
                    break;
                  }
                }
              }
              done(null,allTags);
            }]
          },function(asyncErr,asyncResult){
            if(!asyncErr){
              res.render('post',{
                article:asyncResult.getArticle,
                archiveList:asyncResult.getArchive,
                tags:asyncResult.setChooseTags
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
};