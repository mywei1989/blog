var async = require('async');
var settings = require('../settings/settings.js');
var Post = require('../models/post.js');
var List = require('../models/list.js');


module.exports = function(app){
  app.get('/',function(req,res,next){
    if(req.sessionID){
      var list = new List(
        1,
        settings.pageSize,
        {}
      );
      async.parallel({
        getAllTag:function(done){
          var post = new Post();
          post.getAllTag(function(err,docs){
            if(!(err)&&docs){
              done(null,docs);
            }
          });
        },
        getArchive:function(done){
          list.getArchive(function(err,docs){
            /*console.log(docs);
            if(!(err)&&docs){
              done(null,docs);
            }*/
            done(null,docs);
          });
        },
        getPageCount:function(done){
          list.getCount(function(err,count){
            if(!(err)&&(count!=0)){
              done(null,Math.ceil(count/settings.pageSize));
            }
          });
        },
        getList:function(done){
          list.getList(function(err,docs){
            if(!(err)&&docs){
              done(null,docs);
            }else{
              res.render('list');
            }
          });
        }
      },function(asyncErr,asyncResult){
        if(!asyncErr){
          res.render('list',{
            list:formatList(asyncResult.getList),
            tags:asyncResult.getAllTag,
            pagination:{
              pageIndex:1,
              pageCount:asyncResult.getPageCount
            }
          });
        }else{
          //404
          res.end();
        }
      });
    }
  });

  app.get('/page',function(req,res,next){
    res.redirect('/page/1');
  });
  app.get('/page/*',function(req,res,next){
    if(req.sessionID){
      var pageIndex = req.params[0]||1;
      var list = new List(
        pageIndex,
        settings.pageSize,
        {}
      );
      async.parallel({
        getAllTag:function(done){
          var post = new Post();
          post.getAllTag(function(err,docs){
            if(!(err)&&docs){
              done(null,docs);
            }
          });
        },
        getPageCount:function(done){
          list.getCount(function(err,count){
            if(!(err)&&(count!=0)){
              done(null,Math.ceil(count/settings.pageSize));
            }
          });
        },
        getList:function(done){
          list.getList(function(err,docs){
            if(!(err)&&docs){
              done(null,docs);
            }else{
              res.render('list');
            }
          });
        },
        getArchive:function(done){
          done(null);
        }
      },function(asyncErr,asyncResult){
        if(!asyncErr){
          res.render('list',{
            list:formatList(asyncResult.getList),
            tags:asyncResult.getAllTag,
            pagination:{
              pageIndex:parseInt(pageIndex),
              pageCount:parseInt(asyncResult.getPageCount)
            }
          });
        }else{
          res.end();
        }
      });
    }
  });

  app.get('/tag/:tag',function(req,res,next){

  });


  function formatList(docs){
    for(var i=0;i<docs.length;i++){
      docs[i].timeStr = docs[i].time.year+'年'+docs[i].time.month+'月'+docs[i].time.day+'日';
    }
    return docs;
  }

};