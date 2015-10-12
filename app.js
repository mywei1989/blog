var express = require('express');
var flash = require('connect-flash');
var ejs = require('ejs');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var settings = require('./settings/settings');


var list_routes = require('./routes/list');
var article_routes = require('./routes/article');
var login_routes = require('./routes/login');
var post_routes = require('./routes/post');
var info_routes = require('./routes/info');

var app = express();

//  区分  /page/2  与  /page/2/ 的区别 并且该行不能在任何中间件之后 否则无效
app.enable('strict routing');
//app.set('strict routing',true);   //同上
//console.log(app.enabled('strict routing'));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  name:settings.cookieName,
  secret:settings.cookieSecret,
  cookie:{
    maxAge: 172800000 //两天
  }
}));

app.use(express.static(path.join(__dirname, '/assets'),{redirect: false}));

info_routes(app);
list_routes(app);
article_routes(app);
login_routes(app);
post_routes(app);


module.exports = app;
