var http = require("http");

class server {
	constructor(cerus) {
		this._server = http.createServer(function(req, res) {
			if(typeof this._func === "function") {
				this._func(req, res);
			}
		}.bind(this));
		this._port = 80;
		this._cerus = cerus;
	}

	callback(func) {
		if(typeof func !== "function") {
			throw new TypeError("the argument func must be a function");
		}

		this._func = func;
	}

	start(port) {
		if(this.listening()) {
			throw new Error("the server was already listening");
		}

		if(port !== undefined && typeof port !== "number") {
			throw new TypeError("the argument port must be a number");
		}

		return this._cerus.promise(function(event) {
			this._server.listen(port || this._port, function() {
				event("started");
			});
		}.bind(this));
	}

	listen(port) {
		return this.start(port);
	}

	stop() {
		if(!this.listening()) {
			throw new Error("the server never started listening");
		}

		return this._cerus.promise(function(event) {
			this._server.close(function() {
				event("stopped");
			});
		}.bind(this));
	}

	end() {
		return this.stop();
	}

	port(port) {
		if(typeof port === "number") {
			this._port = port;
		}

		return this._port;
	}

	event() {
		return this._cerus.promise(function(event) {
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

	listening() {
		return this._server.listening;
	}

	maxheaders(maxheaders) {
		if(typeof maxheaders === "number") {
			this._server.maxHeadersCount = maxheaders;
		}

		return this._server.maxHeadersCount;
	}

	maxconnections(maxconnections) {
		if(typeof maxconnections === "number") {
			this._server.maxConnections = maxconnections;
		}

		return this._server.maxConnections;
	}

	connections() {
		if(!this.listening()) {
			throw new Error("the server hasn't started listening");
		}
		
		return this._cerus.promise(function(event) {
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

	alive(alive) {
		if(typeof alive === "number") {
			this._server.keepAliveTimeout = alive;
		}

		return this._server.keepAliveTimeout;
	}

	timeout(timeout) {
		if(typeof timeout === "number") {
			this._server.setTimeout(timeout);
		}

		return this._server.timeout;
	}

	address() {
		if(!this.listening()) {
			throw new Error("the server never started listening");
		}

		if(this._address === undefined) {
			this._address = new address(this._server);
		}

		return this._address;
	}
}

module.exports = server;

class address {
	constructor(server) {
		this._address = server.address();
	}

	port() {
		return this._address.port;
	}

	family() {
		return this._address.family;
	}

	address() {
		return this._address.address;
	}
}
