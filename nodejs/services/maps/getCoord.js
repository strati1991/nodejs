var http = require("http");

function get(address,callback){
	var options = {
	  host: 'maps.google.com',
	  port: 80,
	  path: '/maps/api/geocode/json?address=' + address + '&sensor=false'
	};
	console.log('/maps/api/geocode/json?address=' + address + '&sensor=false');
	cb = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	    data = JSON.parse(str);
	    console.log({lat: data.results[0].geometry.location.lat,lng:data.results[0].geometry.location.lng});
	    callback({lat: data.results[0].geometry.location.lat,lng:data.results[0].geometry.location.lng});
	  });
	}

	http.get(options, cb).end();
}

exports.get = get;