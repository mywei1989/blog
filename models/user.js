var MongoClient = require('./db.js');

function User(user){
  this.name = user.name;
  this.password = user.password;
}

module.exports = User;

User.prototype.login = function(user,callback){

}