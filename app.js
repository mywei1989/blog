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

var app = express();
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
app.use(express.static(path.join(__dirname, '/assets')));





list_routes(app);
article_routes(app);
login_routes(app);
post_routes(app);


module.exports = app;
