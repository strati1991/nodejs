var schema = null;
var users = null;
var url = require('url');

function respond(req,res,sess,db){
  if(users == null){
    Schema = db.Schema;
    schema = new Schema({ loc: { lat:"Number",lng: "Number"}});
    users = db.model('getProducerByFilter',schema,'user');
  }
  var parse = url.parse(req.url,true);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  var _jsonp = null;
  if(parse.query._jsonp != undefined){
    _jsonp = parse.query._jsonp.toString();
    if(parse.query.plz != null){
      var plz = parse.query.plz;
      var getCoords = require("../maps/getCoord");
      getCoords.get(plz,
        function(data){
          sess.query_loc = data.loc;
          var distance = parse.query.distance / 111;
          users.find({loc: {$near: [sess.query_loc.lat,sess.query_loc.lng], $maxDistance:distance} },
            function(err,data){
              res.end(_jsonp + "(" + JSON.stringify(data) + ")");
            }
          );
        });
    } else { 
      var distance = parse.query.distance /111;
      users.find({loc: {$near: [sess.query_loc.lat,sess.query_loc.lng], $maxDistance:distance} },function(err,data){
         res.end(_jsonp + "(" + JSON.stringify(data) + ")");
      });
    }
  } else {
    res.end(_jsonp + "(" + JSON.stringify({ error: "NoJsonpRequest", }) + ")");
  }
}
exports.respond = respond;