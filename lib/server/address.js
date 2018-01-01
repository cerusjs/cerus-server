var address = module.exports = function(server) {
	this._address = server.address();
}

address.prototype.port = function() {
	return this._address.port;
}

address.prototype.family = function() {
	return this._address.family;
}

address.prototype.address = function() {
	return this._address.address;
}