var http = require("http");
function get(address,callback){
	var options = {
		host: 'nominatim.openstreetmap.org',
		port: 80,
		path: '/search?q=' + address + '&format=json&addressdetails=1'
	};
	cb = function(response) {
	var str = '';

	//another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
	});

	  //the whole response has been recieved, so we just print it out here
	response.on('end', function () {
	    data = JSON.parse(str);
		callback({loc:{lat: parseFloat(data[0].lat),lng: parseFloat(data[0].lon)},town:data[0].address.county});
	  	});
	}

	http.get(options, cb).end();
}

exports.get = get;