var walk    = require('walk');
var files   = {};

// Walker options
var walker  = walk.walk('./services', { followLinks: false });

walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
    if(stat.name.indexOf('.js') != -1){
    	files[root.replace('./services','') + '/' + stat.name.replace('.js','')] = root + '/' +  stat.name.replace('.js','');
    }
    next();
});
walker.on('end', function() {
		console.log(files);
});

function distribute(path,req,res,sess,db){
	console.log(files[path]);
 	service = require(files[path]);
 	service.respond(req,res,sess,db);
}

exports.distribute = distribute;

