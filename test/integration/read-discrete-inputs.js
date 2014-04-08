var assert  = require("assert");
var helpers = require("../helpers");
var client  = helpers.client();
var server  = helpers.server();
var trials  = helpers.trials();
var inputs  = helpers.randomBits();
var offset  = 10001;

helpers.pipe(server, client);

server.on("read-discrete-inputs", function (from, to, reply) {
	return reply(null, inputs.slice(from - offset, to - offset + 1));
});

describe("READ_DISCRETE_INPUTS", function () {
	for (var i = 0; i < trials; i++) {
		(function () {
			var from = offset + Math.max(1, Math.floor(Math.random() * inputs.length / 2));
			var to   = Math.min(offset + inputs.length, from + Math.floor(Math.random() * inputs.length / 2));

			it("should pass (" + from + "-" + to + ")", function () {
				return run(from, to);
			});
		})();
	}
});

function run(from, to) {
	client.readDiscreteInputs(10, from, to, function (err, items) {
		for (var i = from; i <= to; i++) {
			assert.equal(inputs[i - offset], items[i - from]);
		}
	});
}
