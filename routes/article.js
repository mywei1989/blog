module.exports = function(app){
  app.get('/article',function(req,res,next){
    if(req.sessionID){
      res.render('article');
    }
  });
};