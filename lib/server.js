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

	self.start = function(port) {
		if(self.listening()) {
			throw new Error("the server was already listening");
		}

		if(port !== undefined && typeof port !== "number") {
			throw new TypeError("argument port must be a number");
		}

		return cerus.promise(function(event) {
			server.listen(port || cerus.settings().port(), function() {
				event("started");
			});
		});
	}

	self.stop = function() {
		if(!self.listening()) {
			throw new Error("the server hasn't started listening");
		}

		return cerus.promise(function(event) {
			server.close(function() {
				event("stopped");
			});
		});
	}

	self.event = function() {
		return cerus.promise(function(event) {
			server.on("error", function(error) {
				event("error", error);
			});

			server.on("close", function() {
				event("close");
			});

			server.on("listening", function() {
				event("listening");
			});

			server.on("connection", function(socket) {
				event("connection", socket);
			});
		});
	}

	self.server = function() {
		return server;
	}

	self.listening = function() {
		return server.listening;
	}

	self.maxheaders = function(max) {
		if(max !== undefined) {
			server.maxHeadersCount = max;
		}

		return server.maxHeadersCount;
	}

	self.maxconnections = function(max) {
		if(max !== undefined) {
			server.maxConnections = max;
		}

		return server.maxConnections;
	}

	self.connections = function() {
		if(!self.listening()) {
			throw new Error("the server hasn't started listening");
		}
		
		return cerus.promise(function(event) {
			server.getConnections(function(err, count) {
				console.log(err, count);
				if(err) {
					event("error");
				}
				else {
					event("connections", count);
				}
			});
		});
	}

	self.alive = function(alive_) {
		if(alive_ !== undefined) {
			server.keepAliveTimeout = alive_;
		}

		return server.keepAliveTimeout;
	}

	self.timeout = function(timeout_) {
		if(timeout_ !== undefined) {
			server.setTimeout(timeout_);
		}

		return server.timeout;
	}

	self.address = function() {
		if(!self.listening()) {
			throw new Error("the server hasn't started listening");
		}

		var self_ = {};

		self_.port = function() {
			return server.address().port;
		}

		self_.family = function() {
			return server.address().family;
		}

		self_.address = function() {
			return server.address().address;
		}

		return self_;
	}

	return self;
}