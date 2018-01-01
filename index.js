module.exports = function() {
	var plugin = {};

	var package = require("./package.json");
	var server;
	
	plugin.name = package["name"];
	plugin.version = package["version"];
	plugin.dependencies = [
		"cerus",
		"cerus-promise",
		"cerus-settings"
	];

	plugin.init_ = function(cerus) {
		server = new (require("./lib/server"))(cerus);
	}

	plugin.server = function() {
		return server;
	}

	return plugin;
}