var async = require('async');
var settings = require('../settings/settings.js');
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


      /*list.getList(function(err,docs){
        if(!(err)&&docs){
          console.log(docs.length);
          res.render('list',{
            list:formatList(docs),
            pagination:{
              pageIndex:59,
              pageCount:docs.length%3
            }
          });
        }else{
          res.render('list');
        }
      });*/
    }
  });

  app.get('/page/:pageIndex',function(req,res,next){
    if(req.sessionID){
      var pageIndex = req.params.pageIndex||1;
      console.log(pageIndex);
      var list = new List(
        pageIndex,
        settings.pageSize,
        {}
      );

      async.parallel({
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
      var tags = docs[i].tags.split(',');
      docs[i].tagsArray = [];
      for(var j=0;j<tags.length;j++){
        docs[i].tagsArray.push(tags[j]);
      }
    }
    //console.log(docs);
    return docs;
  }

};