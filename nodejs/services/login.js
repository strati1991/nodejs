var schema = null;
var users = null;
var url = require('url');

function respond(req,res,sess,db){

  if(users == null){
    Schema = db.Schema;
    schema = new Schema({_id: "Number",username: 'string', password: 'string'});
    users = db.model('user',schema,'user');
  }
  var parse = url.parse(req.url,true);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  var _jsonp = null;
  if(parse.query._jsonp != undefined){
    _jsonp = parse.query._jsonp.toString();
    if(sess.login){
      res.end(_jsonp + "(" + JSON.stringify({ login: true, already:true}) + ")");
      sess.touch();
    } else {
      users.findOne({username: parse.query.username.toString(), password:parse.query.password.toString()}
        ,function(err,data){
          if(data != null){
            sess.login = true;
            sess.userId = parse.query.username.toString();
            res.end(_jsonp+ "(" + JSON.stringify({ login: true }) + ")");
          } else {
            res.end(_jsonp + "(" + JSON.stringify({ login: false}) + ")");
          }
        }
      );
    }
  } else {
    res.end(_jsonp + "(" + JSON.stringify({ error: "NoJsonpRequest", }) + ")");
  }
}
exports.respond = respond;