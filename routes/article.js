var async = require('async');
var settings = require('../settings/settings.js');
var Post = require('../models/post.js');
var List = require('../models/list.js');

module.exports = function(app){
  app.get('/:year/:month/:name',function(req,res,next){
    if(req.sessionID){

    }
  });

  /*app.get('/article',function(req,res,next){
    if(req.sessionID){
      res.render('article');
    }
  });*/

};