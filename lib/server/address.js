/**
 * @class server.address
 */
var address = module.exports = function(server) {
	this._address = server.address();
}

/**
 * @function server.address.port
 */
address.prototype.port = function() {
	return this._address.port;
}

/**
 * @function server.address.family
 */
address.prototype.family = function() {
	return this._address.family;
}

/**
 * @function server.address.address
 */
address.prototype.address = function() {
	return this._address.address;
}