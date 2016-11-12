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
              article.getEdit(function(err,doc){
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
              var allTags = asyncResult.getAllTag;
              var articleTags = asyncResult.getArticle.tags;
              for(var i=0;i<allTags.length;i++){
                for(var j=0;j<articleTags.length;j++){
                  if(allTags[i].tag===articleTags[j].tag){
                    allTags[i].checked = "checked";
                    break;
                  }
                }
              }
              res.render('post',{
                article:asyncResult.getArticle,
                archiveList:asyncResult.getArchive,
                tags:allTags
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
  app.post('/:year/:month/:name/edit',function(req,res,next){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
          var formData = req.body;
          var year = parseInt(req.params.year);
          var month = parseInt(req.params.month);
          if((!year)&&(!month)){
            res.status(404).end();
            return;
          }
          async.waterfall([
            function(done){
              var post = new Post({});
              post.getAllTag(function(err,docs){
                var tags=[];
                if(!(err)&&docs){
                  //判断是否勾选了任何一个 tag
                  if(formData.hasOwnProperty('tags')){
                    var tagsArrayStr = formData.tags.toString();
                    var tagsArray = tagsArrayStr.split(',');

                    //1.保存勾选的tag
                    for(var i=0;i<tagsArray.length;i++){
                      if(tagsArray[i]==='newtags'){
                        continue;
                      }else{
                        for(var j=0;j<docs.length;j++){
                          if(tagsArray[i]===docs[j].tag){
                            tags.push({tag:tagsArray[i],tagName:docs[j].tagName});
                            break;
                          }
                        }
                      }
                    }
                    //2.保存新增的 tag
                    var newtagsStr = formData.newtags;
                    if(tagsArrayStr.indexOf('newtags')>1&&newtagsStr.length>0){
                      var newTagArray = newtagsStr.split(',');
                      for(var i=0;i<newTagArray.length;i++){
                        var newTagTemp = newTagArray[i].split(':')[0];
                        var newTagNameTemp = newTagArray[i].split(':')[1];
                        //防止重复添加相同标签
                        var isHas = false;
                        for(var j=0;j<docs.length&&isHas==false;j++){
                          if(newTagTemp===docs[j].tag){
                            isHas=true;
                            break;
                          }
                        }
                        if(!isHas){
                          tags.push({tag:newTagTemp,tagName:newTagNameTemp});
                        }

                      }
                    }
                  }
                  done(null,tags);
                }
              });
            },
            function(tags,done){
              var date = new Date(formData.date);
              var post = new Post({
                name:formData.name,
                title:formData.title,
                date:date,
                tags:tags,
                post:formData.post,
                queryObj:{"time.year":year,"time.month":month,name:req.params.name}
              });
              post.update(function(err){
                if(err===null){
                  done(null);
                }
              });
            }
          ],function(asyncErr,asyncResult){
            res.redirect('/'+year+'/'+month+'/'+formData.name+'/edit');
          });
        }else{
          res.redirect('/login');
        }
      });
    }
  });
};