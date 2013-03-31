var schema = null;
var users = null;
var url = require('url');

function respond(req,res,sess,db){
  if(users == null){
    Schema = db.Schema;
    schema = new Schema({ _id: "Number"});
    users = db.model('getUserData',schema,'user');
  }
  var parse = url.parse(req.url,true);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  var _jsonp = null;
  if(parse.query._jsonp != undefined){
    _jsonp = parse.query._jsonp.toString();
    if(sess.login){
      users.findOne({"username" : sess.userId},{_id: 0,password:0}
        ,function(err,data){
          if(data != null){
            res.end(_jsonp+ "(" + JSON.stringify(data) + ")");
          } else {
            res.end(_jsonp + "(" + JSON.stringify({ error: "UserIdIsWrong" }) + ")");
          }
        }
      );
      sess.touch();
    } else {     
      res.end(_jsonp + "(" + JSON.stringify({ error: "NotLoggedIn", }) + ")");
    }
  } else {
    res.end(_jsonp + "(" + JSON.stringify({ error: "NoJsonpRequest", }) + ")");
  }
}
exports.respond = respond;