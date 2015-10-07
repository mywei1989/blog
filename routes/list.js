var List = require('../models/list.js');


module.exports = function(app){
  app.get('/',function(req,res,next){
    if(req.sessionID){
      //res.render('list');
      var list = new List(
        1,
        10,
        ''
      );
      list.getList(function(err,docs){
        if(!(err)&&docs){

          res.render('list',{
            list:formatList(docs),
            pagination:{
              pageIndex:30,
              pageCount:62
            }
          });
        }else{
          res.render('list');
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
    console.log(docs);
    return docs;
  }
};