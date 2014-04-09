var assert  = require("assert");
var helpers = require("../helpers");
var client  = helpers.client();
var server  = helpers.server();
var trials  = helpers.trials();
var coils   = helpers.randomBits();

helpers.pipe(server, client);

server.on("read-coils", function (from, to, reply) {
	return reply(null, coils.slice(from, to + 1));
});

describe("READ_COILS", function () {
	for (var i = 0; i < trials; i++) {
		(function () {
			var from = Math.max(0, Math.floor(Math.random() * coils.length / 2));
			var to   = Math.min(coils.length, from + Math.floor(Math.random() * coils.length / 2));

			it("should pass (" + from + "-" + to + ")", function () {
				return run(from, to);
			});
		})();
	}
});

function run(from, to) {
	client.readCoils(10, from, to, function (err, items) {
		for (var i = from; i <= to; i++) {
			assert.equal(coils[i], items[i - from]);
		}
	});
}
