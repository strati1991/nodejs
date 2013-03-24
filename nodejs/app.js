var connect = require('connect');
var url = require('url');
var distributer = require('./distributer');
var db = require('mongoose');
var MongoStore = require('connect-session-mongo');
db.connect('mongodb://localhost/test');

var conf = {
  db: 'test',
  secret: 'P74G87keRaoRnqxRKI9KLr351BW6Bk7l'
};

var app = connect()
  .use(connect.cookieParser())
  .use(connect.session({ secret: conf.secret, cookie: { maxAge: 20*60*1000 },store: new MongoStore(conf)}))
  .use(function(req, res){
    var path = url.parse(req.url).pathname;
    var sess = req.session;
    distributer.distribute(path,req,res,sess,db);
  })
 .listen(3000);