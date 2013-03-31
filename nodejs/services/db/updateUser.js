var url = require('url');

var schema = null;
var users = null;
var ObjectId = null;

function respond(req,res,sess,db){
  if(users == null){
    Schema = db.Schema;
    ObjectId = Schema.ObjectId;
    schema = new Schema({ plz: "Number",street: "String",hnr: "Number",username: "String"});
    users = db.model('updateUser',schema,'user');
  }
  var parse = url.parse(req.url,true);
  console.log(JSON.stringify(req.files));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  var _jsonp = null;
  if(parse.query._jsonp != undefined){
    _jsonp = parse.query._jsonp.toString();
    if(sess.login){
      users.findOne({"username" : sess.userId},{ _id:0, password: 0}
        ,function(err,data){
          if(data != null){
            var key = parse.query.key;
            var value = parse.query.value;
            var json = { };
            json[key] = value; 
            if(key == "plz" || key == "street" || key == "hnr"){
              var getCoords = require("../maps/getCoord");
              getCoords.get(data['street']+ "+" + data['plz'] + "+" + data['hnr'],
              function(data){
                json["loc"] = data.loc;
                json["town"] = data.town;
                users.collection.update({"username": sess.userId},{$set: json},{ multi: false },function(err){res.end(_jsonp+ "(" + err + ")")});
              });
            } else {
              users.collection.update({"username": sess.userId},{$set: json},{ multi: false },function(err){res.end(_jsonp+ "(" + err + ")")});
            }
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