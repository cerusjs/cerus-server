var http = require("http");
var address = require("./server/address");
var cerus;

var server = module.exports = function(cerus_) {
	this._server = http.createServer(function(req, res) {
		if(typeof this._func === "function") {
			this._func(req, res);
		}
	}.bind(this));
	this._port = 80;

	cerus = cerus_;
}

server.prototype.callback = function(func) {
	if(typeof func !== "function") {
		throw new TypeError("the argument func must be a function");
	}

	this._func = func;
}

server.prototype.start = server.prototype.listen = function(port) {
	if(this.listening()) {
		throw new Error("the server was already listening");
	}

	if(port !== undefined && typeof port !== "number") {
		throw new TypeError("the argument port must be a number");
	}

	return cerus.promise(function(event) {
		this._server.listen(port || this._port, function() {
			event("started");
		});
	}.bind(this));
}

server.prototype.stop = server.prototype.end = function() {
	if(!this.listening()) {
		throw new Error("the server never started listening");
	}

	return cerus.promise(function(event) {
		this._server.close(function() {
			event("stopped");
		});
	}.bind(this));
}

server.prototype.event = function() {
	return cerus.promise(function(event) {
		this._server.on("error", function(error) {
			event("error", error);
		});

		this._server.on("close", function() {
			event("close");
		});

		this._server.on("listening", function() {
			event("listening");
		});

		this._server.on("connection", function(socket) {
			event("connection", socket);
		});
	}.bind(this));
}

server.prototype.port = function(port) {
	if(typeof port === "number") {
		self._port = port;
	}

	return self._port;
}

server.prototype.server = function() {
	return this._server;
}

server.prototype.listening = function() {
	return this._server.listening;
}

server.prototype.maxheaders = function(maxheaders) {
	if(typeof maxheaders === "number") {
		this._server.maxHeadersCount = maxheaders;
	}

	return this._server.maxHeadersCount;
}

server.prototype.maxconnections = function(maxconnections) {
	if(typeof maxconnections === "number") {
		this._server.maxConnections = maxconnections;
	}

	return this._server.maxConnections;
}

server.prototype.connections = function() {
	if(!this.listening()) {
		throw new Error("the server hasn't started listening");
	}
	
	return cerus.promise(function(event) {
		this._server.getConnections(function(err, count) {
			
			if(err) {
				event("error");
			}
			else {
				event("connections", count);
			}
		});
	}.bind(this));
}

server.prototype.alive = function(alive) {
	if(typeof alive === "number") {
		this._server.keepAliveTimeout = alive;
	}

	return this._server.keepAliveTimeout;
}

server.prototype.timeout = function(timeout) {
	if(typeof timeout === "number") {
		this._server.setTimeout(timeout);
	}

	return this._server.timeout;
}

server.prototype.address = function() {
	if(!this.listening()) {
		throw new Error("the server never started listening");
	}

	if(this._address === undefined) {
		this._address = new address(this._server);
	}

	return this._address;
}

/*
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
*/