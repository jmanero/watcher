var EventEmitter = require('events').EventEmitter;
var FS = require('fs');
var Path = require('path');
var Util = require('util');

var Search = require('./search');

var Watch = module.exports = function(options) {
	options = options || {};
	EventEmitter.call(this);

	var self = this;
	this.root = options.root || __dirname;

	this.refresh = options.refresh || 5 * 1000; // Default 5 seconds
	this.nodes = {};
	this.interval = 0;
	this.started = false;

	this.search = new Search({
		root : this.root
	});

	// Listen for new files
	this.search.on('file', function(path) {
		watch.call(self, path);
	});

	this.search.on('folder', function(path) {
		watchDir.call(self, path);
	});

	this.search.on('error', function(err) {
		self.emit('error', err);
	});

};

Util.inherits(Watch, EventEmitter);

Watch.prototype.start = function() {
	var self = this;

	if (this.interval == 0) {
		update.call(this);

		// Refresh Routine
		this.interval = setInterval(function() {
			self.started = true;
			verify.call(self);
			update.call(self);

		}, this.refresh);

	}
};

Watch.prototype.stop = function() {
	clearInterval(this.interval);
	this.interval = 0;
	this.started = false;

	for ( var node in this.nodes) {
		if (this.nodes[node].dir)
			this.nodes[node].close();

		delete this.nodes[node];

	}
};

function verify() {
	var self = this;

	function statCB(node) {
		return function(err, stat) {
			if (err) {
				self.emit('delete', {
					path : node.path,
					dir : node.dir
				});

				if (!node.dir)
					node.close();

				delete self.nodes[node.path];

			}
		};
	}

	for ( var node in this.nodes) {
		var target = Path.join(this.root, node);
		var cb = statCB(this.nodes[node]);

		FS.stat(target, cb);

	}

}

function update() {
	this.search.start();
}

function watchDir(path) {
	if (typeof (this.nodes[path]) == 'undefined') {

		if (this.started) {
			this.emit('create', {
				path : path,
				dir : true
			});
		}

		this.emit('watching', {
			path : path,
			dir : true
		});
		this.nodes[path] = {
			path : path,
			dir : true
		};
		
	}
}

function watch(path) {
	if (typeof (this.nodes[path]) == 'undefined') {
		var self = this;

		var target = Path.join(this.root, path);
		var fsw = FS.watch(target, function() {
		});
		fsw.path = path;
		fsw.dir = false;
		fsw.wait = 0;

		fsw.on('change', function(event, file) {
			clearTimeout(this.wait);

			this.wait = setTimeout(function() {
				FS.stat(fsw.path, function(err, stat) {
					if (!err) {
						self.emit('change', {
							path : fsw.path,
							dir : false
						});

					}
				});
			}, 100);
		});

		fsw.on('error', function(err) {
			FS.stat(this.path, function(err, stat) {
				if (err && (err.code == "ENOENT" || err.code == "EPERM")) {
					fsw.close();

				} else {
					self.emit('error', {
						method : 'Watch.watch',
						err : err
					});

				}
			});
		});

		if (self.started) {
			self.emit('create', {
				path : path,
				dir : false
			});
		}

		self.emit('watching', {
			path : path,
			dir : false
		});
		self.nodes[path] = fsw;
	}
}
