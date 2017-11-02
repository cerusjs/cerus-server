module.exports = function(cerus) {
	var self = {};

	var http = require("http");
	var func;
	var server = http.createServer(function(req, res) {
		if(func !== undefined) {
			func(req, res);
		}
	});

	self.callback = function(func_) {
		if(typeof func_ !== "function") {
			throw new TypeError("argument func_ must be a function");
		}

		func = func_;
	}

	self.start = function() {
		return cerus.promise(function(event) {
			server.listen(cerus.settings().port(), function() {
				event("started");
			});
		});
	}

	self.stop = function() {
		return cerus.promise(function(event) {
			server.close(function() {
				event("stopped");
			});
		});
	}

	self.listening = function() {
		return server.listening;
	}

	self.maxheaders = function() {
		return server.maxHeadersCount;
	}

	self.maxconnections = function() {
		return server.maxHeadersCount;
	}

	self.connections = function() {
		return cerus.promise(function(event) {
			server.getConnections(function(err, count) {
				if(err) {
					event("error");
				}
				else {
					event("connections", count);
				}
			});
		});
	}

	self.address = function() {
		var self = {};

		self.port = function() {
			server.address().port;
		}

		self.family = function() {
			server.address().family;
		}

		self.address = function() {
			server.address().address;
		}

		return self;
	}

	return self;
}