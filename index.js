module.exports = function() {
	var package = require("./package.json");
	var server;
	
	this.name = package["name"];
	this.version = package["version"];
	this.dependencies = [
		"cerus",
		"cerus-promise",
		"cerus-settings"
	];

	this.init_ = function(cerus) {
		server = require("./lib/server")(cerus);
	}

	this.server = function() {
		return server;
	}

	return this;
}