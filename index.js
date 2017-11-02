module.exports = function() {
	var self = {};

	var package = require("./package.json");
	
	self.name = package["name"];
	self.version = package["version"];
	self.dependencies = [
		"cerus",
		"cerus-promise",
		"cerus-settings"
	];

	var server;

	self.init_ = function(cerus) {
		server = require("./lib/server")(cerus);
	}

	self.server = function() {
		return server;
	}

	return self;
}