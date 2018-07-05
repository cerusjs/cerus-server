var expect = require("chai").expect;
var http = require("http");
var cerus = require("cerus")();
cerus.use(require("cerus-request")());
var server = require("../index")();
server._init(cerus);

describe("server", function() {
	describe("constructor", function() {
		context("with no parameters", function() {
			it("shouldn't throw an error", function() {
				var func = function() {
					server._init(cerus);
					server.server();
				}

				expect(func).to.not.throw();
			});
		});
	});

	describe("#start", function() {
		context("with no parameters", function() {
			it("shouldn't throw an error", function(done) {
				var func = function() {
					server._init(cerus);
					server.server().start()
					.then(function() {
						server.server().stop();
						done();
					});
				}

				expect(func).to.not.throw();
			});
		});

		context("with a server running and no parameters", function() {
			it("should throw an error", function(done) {
				server._init(cerus);
				server.server().start()
				.then(function() {
					var func = function() {
						server.server().start();
					}

					expect(func).to.throw();
					done();
					server.server().stop();
				});
			});
		});

		context("with a number as parameter", function() {
			it("shouldn't throw an error", function(done) {
				var func = function() {
					server._init(cerus);
					server.server().start(12345)
					.then(function() {
						server.server().stop();
						done();
					});
				}

				expect(func).to.not.throw();
			});
		});

		context("with a string as parameter", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					server._init(cerus);
					server.server().start("error");
				}

				expect(func).to.throw();
			});
		});
	});

	describe("#callback", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					server._init(cerus);
					server.server().callback();
				}

				expect(func).to.throw();
			});
		});

		context("with a non-function as parameter", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					server._init(cerus);
					server.server().callback("error");
				}

				expect(func).to.throw();
			});
		});

		context("with no server running and a function as parameter", function() {
			it("should not be called", function() {
				server._init(cerus);
				server.server().callback(function() {
					throw new Error("this should not be called");
				});
			});
		});

		context("with a server running and a function as parameter", function() {
			it("should be called", function(done) {
				server._init(cerus);
				server.server().callback(function(req, res) {
					res.end();
					done();
				});
				server.server().start()
				.then(function() {
					cerus.request()
					.send(function() {
						server.server().stop();
					});
				});
			});
		});
	});

	describe("#stop", function() {
		context("with no running server and no parameters", function() {
			it("should throw an error", function() {
				var func = function() {
					server._init(cerus);
					server.server().stop();
				}

				expect(func).to.throw();
			});
		});

		context("with a running server and no parameters", function() {
			it("shouldn't throw an error", function(done) {
				var func = function() {
					server._init(cerus);
					server.server().start()
					.then(function() {
						server.server().stop()
						.then(function() {
							done();
						});
					});
				}

				expect(func).to.not.throw();
			});
		});
	});

	describe("#listening", function() {
		context("with no running server and no parameters", function() {
			it("should return false", function() {
				server._init(cerus);
				var listening = server.server().listening();
				expect(listening).to.equal(false);
			});
		});

		context("with a running server and no parameters", function(done) {
			it("should return true", function() {
				server._init(cerus);
				server.server().start()
				.then(function() {
					var listening = server.server().listening();
					expect(listening).to.equal(true);
					server.server().stop();
					done();
				});
			});
		});
	});

	describe("#maxheaders", function() {
		context("with no parameters", function() {
			it("should return the default value", function() {
				server._init(cerus);
				var max = server.server().maxheaders();
				expect(max).to.equal(null);
			});
		});

		context("with 2500 as parameter", function() {
			it("should return the new value", function() {
				server._init(cerus);
				var max = server.server().maxheaders(2500);
				expect(max).to.equal(2500);
			});
		});
	});

	describe("#maxconnections", function() {
		context("with no parameters", function() {
			it("should return the default value", function() {
				server._init(cerus);
				var max = server.server().maxconnections();
				expect(max).to.equal(undefined);
			});
		});

		context("with 100 as parameter", function() {
			it("should return the new value", function() {
				server._init(cerus);
				var max = server.server().maxconnections(100);
				expect(max).to.equal(100);
			});
		});
	});

	describe("#alive", function() {
		context("with no parameters", function() {
			it("should return the default value", function() {
				server._init(cerus);
				var max = server.server().alive();
				expect(max).to.equal(5000);
			});
		});

		context("with 8000 as parameter", function() {
			it("should return the new value", function() {
				server._init(cerus);
				var max = server.server().alive(8000);
				expect(max).to.equal(8000);
			});
		});
	});

	describe("#timeout", function() {
		context("with no parameters", function() {
			it("should return the default value", function() {
				server._init(cerus);
				var max = server.server().timeout();
				expect(max).to.equal(120000);
			});
		});

		context("with 150000 as parameter", function() {
			it("should return the new value", function() {
				server._init(cerus);
				var max = server.server().timeout(150000);
				expect(max).to.equal(150000);
			});
		});
	});

	describe("#connections", function() {
		context("with no running server", function() {
			it("should throw an error", function() {
				var func = function() {
					server._init(cerus);
					server.server().connections();
				}

				expect(func).to.throw();
			});
		});

		context("with a running server and 0 connections", function() {
			it("should return the number 0", function(done) {
				server._init(cerus);
				server.server().start()
				.then(function() {
					server.server().connections()
					.then(function(value) {
						expect(value).to.equal(0);
						server.server().stop();
						done();
					});
				});
			});
		});
	});

	describe("#address", function() {
		describe("constructor", function() {
			context("with no running server", function() {
				it("should throw an error", function() {
					var func = function() {
						server._init(cerus);
						server.server().address();
					}

					expect(func).to.throw();
				});
			});
		});

		describe("#address", function() {
			context("with no running server", function() {
				it("should throw an error", function() {
					var func = function() {
						server._init(cerus);
						server.server().address().address();
					}

					expect(func).to.throw();
				});
			});

			context("with a running server", function() {
				it("should return an object with the string object.address", function(done) {
					server._init(cerus);
					server.server().start()
					.then(function() {
						var address = server.server().address().address();
						expect(address).to.be.a("string");
						server.server().stop();
						done();
					});
				});
			});
		});

		describe("#port", function() {
			context("with no running server", function() {
				it("should throw an error", function() {
					var func = function() {
						server._init(cerus);
						server.server().address().port();
					}

					expect(func).to.throw();
				});
			});

			context("with no running server", function() {
				it("should return an object with the number object.port", function(done) {
					server._init(cerus);
					server.server().start()
					.then(function() {
						var port = server.server().address().port();
						expect(port).to.be.a("number");
						server.server().stop();
						done();
					});
				});
			});
		});

		describe("#family", function() {
			context("with no running server", function() {
				it("should throw an error", function() {
					var func = function() {
						server._init(cerus);
						server.server().address().family();
					}

					expect(func).to.throw();
				});
			});

			context("with no running server", function() {
				it("should return an object with the string object.family", function(done) {
					server._init(cerus);
					server.server().start()
					.then(function() {
						var family = server.server().address().family();
						expect(family).to.be.a("string");
						server.server().stop();
						done();
					});
				});
			});
		});
	});
});