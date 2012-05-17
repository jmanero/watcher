
var Path = require('path');
var Util = require('util');

var Watch = require('../src/watch');

var path = Path.join(__dirname, 'test_watch');
Util.puts("Testing watch.js");
Util.puts("  Watching " + path);

var watch = new Watch({ root : path });

watch.on('watching', function(o) {
	Util.debug("Watching: " + o.path + (o.dir === true ? ' [DIR]' : ''));
});

watch.on('create', function(o) {
	Util.debug("Create: " + o.path + (o.dir === true ? ' [DIR]' : ''));
});

watch.on('change', function(o) {
	Util.debug("Change: " + o.path + (o.dir === true ? ' [DIR]' : ''));
});

watch.on('delete', function(o) {
	Util.debug("Delete: " + o.path + (o.dir === true ? ' [DIR]' : ''));
});

watch.on('error', function(err) {
	Util.debug("Error: " + Util.inspect(err, false, null));
});

watch.start();
