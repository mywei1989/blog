
module.exports = function(app){
  app.get('/',function(req,res,next){
    if(req.sessionID){
      res.render('list');
    }
  });
};