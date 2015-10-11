var async = require('async');
var settings = require('../settings/settings.js');
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
      var list = new List({});
      var year = parseInt(req.params.year);
      var month = parseInt(req.params.month);
      if((!year)&&(!month)){
        res.status(404).end();
        return;
      }
      var post = new Post({
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
          post.getArticle(function(err,doc){
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



};