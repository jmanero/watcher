var EventEmitter = require('events').EventEmitter;
var FS = require('fs');
var Path = require('path');
var Util = require('util');

var Search = module.exports = function(options) {
	options = options || {};
	EventEmitter.call(this);
	var self = this;

	this.root = options.root || __dirname;
	this.filter = options.filter || function() {
		return true;
	};

	this.on('__node', function(node) {
		search.call(self, node);
	});

};

Util.inherits(Search, EventEmitter);

Search.prototype.start = function(root) {
	root = root || this.root;

	search.call(this, root);
};

function search(path) {
	var self = this;

	FS.stat(path, function(err, stat) {
		if (err) {
			self.emit('error', {
				method : 'search.stat',
				error : err
			});

		} else if (stat.isDirectory()) {
			self.emit('folder', path);

			FS.readdir(path, function(err, files) {
				if (err) {
					self.emit('error', {
						method : 'search.readdir',
						error : err
					});

				} else {
					files.forEach(function(file) {
						var node = Path.join(path, file);

						if (self.filter(node))
							self.emit('__node', node);
					});

				}
			});
		} else {
			self.emit('file', path);

		}
	});
}
