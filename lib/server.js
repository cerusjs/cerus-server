var http = require("http");

/**
 * This is the server class. With you can easily create and manage a http server. This class is 
 * also needed when working with the cerus-router. When there is a request the callback function is
 * called. This callback has to be set if you want to receive incoming requets. It must be noted 
 * that this name can be confusing and therefor a different module is on it's way. This means this 
 * class will be deprecated somewhere in the near future.
 * @example
 * // in this example a server is created and started
 * cerus.server().callback(function(req, res) {});
 * // -> now all incoming request will call this function
 * 
 * cerus.server().start();
 * // -> starts the server on port 80
 * @class server
 */
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

	/**
	 * This function sets the callback function for the server. This function will be called when 
	 * there is a new request. The function will be called with to parameters: req and res. The 
	 * req parameter contains the request (http.IncomingMessage) and the res parameter the response
	 * (http.ServerResponse). For a custom and better req and res take a look at the cerus-router 
	 * module. 
	 * @example
	 * cerus.server().callback(function(req, res) {});
	 * // -> this will set the callback function
	 * @summary Sets the callback that will be called for incoming requests.
	 * @param {Function} func The callback function.
	 * @function callback
	 */
	callback(func) {
		if(typeof func !== "function") {
			throw new TypeError("the argument func must be a function");
		}

		this._func = func;
	}

	/**
	 * This function is used to start the server. You can also supply a port if you don't want to 
	 * use the one that is currently set. The server cannot be started when it is already running.
	 * This function will also return a promise. This promise will call the "started" event when 
	 * the server has been started.
	 * @example
	 * cerus.server().start(); // or cerus.server().listen();
	 * // -> starts the server on the default port 80
	 * @summary Starts the server.
	 * @alias listen
	 * @param {Number} (port) The port that the server will use.
	 * @return {Promise} This function will return a promise.
	 * @function start
	 */
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

	/**
	 * This function will stop the server. It can only be called if the server is already running. 
	 * It'll also return a promise that calls the "stopped" event when the function has finished 
	 * stopping the server.
	 * @example
	 * // with a server already running
	 * cerus.server().stop(); // or cerus.server().end();
	 * // -> stops the server
	 * @summary Stops the server.
	 * @alias end
	 * @return {Promise} This function will return a promise.
	 * @function stop
	 */
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

	/**
	 * This is a getter and setter for the port that will be used for the server. It is possible to
	 * not use this port by supplying a port to the .start() function directly.
	 * @summary The getter/setter for the server port.
	 * @param {Number} (port) The new server port.
	 * @return {Number} The server port.
	 * @function port
	 */
	port(port) {
		if(typeof port === "number") {
			this._port = port;
		}

		return this._port;
	}

	/**
	 * With this function you can listen for server events. It'll return a promise that is called 
	 * on a number of events. The "error" event is called when there was an error in the server. It
	 * is called with the error as parameter. The "close" event is called when the server was 
	 * closed. The "listening" event is called when the server has started listening. The 
	 * "connection" event is called when there was a new connection together with the new socket as
	 * paramater.
	 * @summary Returns a promise that is called on every event.
	 * @return {Promise} This function will return a promise.
	 * @function event
	 */
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

	/**
	 * This function returns if the server is currently listening for requests. This means that 
	 * this function returns if the server has started or if it's currently stopped.
	 * @summary Returns if the server is listening.
	 * @return {Boolean} If the server is listening.
	 * @function listening
	 */
	listening() {
		return this._server.listening;
	}

	/**
	 * This is a getter and setter for the maximum amount of headers that the server will accept in 
	 * a HTTP request. The default maximum amount of headers is 2000.
	 * @summary The getter/setter for the maximum amount of headers.
	 * @param {Number} (maxheaders) The new maximum amount of headers.
	 * @return {Number} The maximum amount of headers.
	 * @function maxheaders
	 */
	maxheaders(maxheaders) {
		if(typeof maxheaders === "number") {
			this._server.maxHeadersCount = maxheaders;
		}

		return this._server.maxHeadersCount;
	}

	/**
	 * This is a getter and setter for the maximum amount of connections that the server will accept 
	 * before refusing requests. By default there is no maximum amount of connections.
	 * @summary The getter/setter for the maximum amount of connections.
	 * @param {Number} (maxconnections) The new maximum amount of connections.
	 * @return {Number} The maximum amount of connections.
	 * @function maxconnections
	 */
	maxconnections(maxconnections) {
		if(typeof maxconnections === "number") {
			this._server.maxConnections = maxconnections;
		}

		return this._server.maxConnections;
	}

	/**
	 * This function will return the current amount of connections. The connections will be 
	 * returned using a promise. The amount of connections will be a parameter in the connections 
	 * event. The amount of connections can only be fetched if the server is listening.
	 * @summary Returns the amount of active connections.
	 * @return {Number} The amount of connections.
	 * @function connections
	 */
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

	/**
	 * This is a getter and setter for the number of milliseconds of inactivity the server needs to 
	 * wait for incoming data. If it takes more than the alive time the request is presumed 
	 * inactive. The default time is 5000 milliseconds (5 seconds).
	 * @summary The getter/setter for the keep alive timeout time.
	 * @param {Number} (alive) The keep alive timeout time.
	 * @return {Number} The keep alive timeout time.
	 * @function alive
	 */
	alive(alive) {
		if(typeof alive === "number") {
			this._server.keepAliveTimeout = alive;
		}

		return this._server.keepAliveTimeout;
	}

	/**
	 * This is a getter and setter for the number of milliseconds of inactivity a socket can use 
	 * before being presumed to have timed out. When a socket is presumed to have timed out the 
	 * connection is destroyed. The default time 120000 (2 minutes).
	 * @summary The getter/setter for the timeout time.
	 * @param {Number} (timeout) The timeout time.
	 * @return {Number} The timeout time.
	 * @function timeout
	 */
	timeout(timeout) {
		if(typeof timeout === "number") {
			this._server.setTimeout(timeout);
		}

		return this._server.timeout;
	}

	/**
	 * This function will return the address class for this server. The address class contains 
	 * information about the address the server is using. This class can only be returned of the 
	 * server is listening.
	 * @summary Returns the server.address class.
	 * @return {Class} The server.address class.
	 * @function address
	 */
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

/**
 * This is the address class for the server. It contains information about the server, like the 
 * port and ip address.
 * @class server.address
 */
class address {
	constructor(server) {
		this._address = server.address();
	}

	/**
	 * This function will return the port the server is currently listening on.
	 * @summary Returns the port the server is using.
	 * @return {Number} The port the server is using.
	 * @function port
	 */
	port() {
		return this._address.port;
	}

	/**
	 * This function will return if the ip the server is currently using is IPv4 or IPv6.
	 * @summary Returns the family of the server's ip.
	 * @return {String} The family of the server's ip.
	 * @function family
	 */
	family() {
		return this._address.family;
	}

	/**
	 * This function will return the ip the server is currently using.
	 * @summary Returns the ip of the server.
	 * @return {String} The ip of the server.
	 * @function address
	 */
	address() {
		return this._address.address;
	}
}
