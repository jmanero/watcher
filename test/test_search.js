
var Assert = require('assert');
var Path = require('path');
var Util = require('util');

var Search = require('../src/search');

var path = Path.join(__dirname, '../');
Util.puts('Testing search.js');
Util.puts('  Searching ' + path);

var s = new Search({root : path});

s.on('file', function(path) {
	Util.debug("File: " + path);
});

s.on('folder', function(path) {
	Util.debug("Folder: " + path);
});

s.start();
