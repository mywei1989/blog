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
      var post = new Post();
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
            archiveList:asyncResult.getArchive,
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
    res.redirect(301,'/page/1/');
  });
  app.get('/page/:page',function(req,res,next){
    res.redirect(301,'/page/'+req.params.page+'/');
  });
  app.get('/page/:page/',function(req,res,next){
    if(req.sessionID){
      var pageIndex = req.params.page;
      var list = new List(
        pageIndex,
        settings.pageSize,
        {}
      );
      var post = new Post();
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
            archiveList:asyncResult.getArchive,
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

  /*app.get('/tag',function(req,res,next){
    //res.redirect(301,);
  });*/
  app.get('/tag/:tag',function(req,res,next){
    res.redirect(301,'/tag/'+req.params.tag+'/');
  });
  app.get('/tag/:tag/',function(req,res,next){
    if(req.sessionID){
      var list = new List(
        1,
        settings.pageSize,
        {"tags":{$elemMatch:{"tag":req.params.tag}}}
      );
      var post = new Post();
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
        getPageCount:function(done){
          list.getCount(function(err,count){
            if(!(err)&&(count!=0)){
              done(null,Math.ceil(count/settings.pageSize));
            }else{
              done(err);
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
            archiveList:asyncResult.getArchive,
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
  app.get('/tag/:tag/page/:page',function(req,res,next){
    res.redirect(301,'/tag/'+req.params.tag+'/page/'+req.params.page+'/');
  });
  app.get('/tag/:tag/page/:page/',function(req,res,next){
    if(req.sessionID){
      var pageIndex = req.params.page;
      var list = new List(
        pageIndex,
        settings.pageSize,
        {"tags":{$elemMatch:{"tag":req.params.tag}}}
      );
      var post = new Post();
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
        getPageCount:function(done){
          list.getCount(function(err,count){
            if(!(err)&&(count!=0)){
              done(null,Math.ceil(count/settings.pageSize));
            }else{
              done(err);
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
            archiveList:asyncResult.getArchive,
            tags:asyncResult.getAllTag,
            pagination:{
              pageIndex:parseInt(pageIndex),
              pageCount:parseInt(asyncResult.getPageCount)
            }
          });
        }else{
          //404
          res.end();
        }
      });
    }
  });




  function formatList(docs){
    for(var i=0;i<docs.length;i++){
      docs[i].timeStr = docs[i].time.year+'年'+docs[i].time.month+'月'+docs[i].time.day+'日';
    }
    return docs;
  }

};