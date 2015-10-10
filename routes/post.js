var async = require('async');
var User = require('../models/user.js');
var List = require('../models/list.js');
var Post = require('../models/post.js');

module.exports = function(app){
  app.get('/post',function(req,res){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      user.checkLogin(function(err,usercookieinfo){
        if(usercookieinfo){
          var list = new List({});
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
            tags:asyncResult.getAllTag
          });
        });
        }else{
          res.redirect('/login');
        }
      });
    }
  });

  app.post('/post',function(req,res){
    if(req.sessionID){
      var user = new User({
        sessionID:req.sessionID
      });
      var formData = req.body;
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
                if(tagsArrayStr.indexOf('newtags')>-1&&newtagsStr.length>0){
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
            post:formData.post
          });
          post.save(function(err){
            if(err===null){
              done(null);
            }
          });
        }
      ],function(asyncErr,asyncResult){
        res.redirect('/post');
      });
    }
  });


};