var assert    = require("assert");
var helpers   = require("../helpers");
var client    = helpers.client();
var server    = helpers.server();
var trials    = helpers.trials();
var registers = helpers.randomBuffers();

helpers.pipe(server, client);

server.on("read-holding-registers", function (from, to, reply) {
	return reply(null, registers.slice(from, to + 1));
});

describe("READ_HOLDING_REGISTERS", function () {
	for (var i = 0; i < trials; i++) {
		(function () {
			var from = Math.max(0, Math.floor(Math.random() * registers.length / 2));
			var to   = Math.min(registers.length, from + Math.floor(Math.random() * registers.length / 2));

			it("should pass (" + from + "-" + to + ")", function () {
				return run(from, to);
			});
		})();
	}
});

function run(from, to) {
	client.readHoldingRegisters(10, from, to, function (err, items) {
		for (var i = from; i <= to; i++) {
			assert.equal(registers[i][0], items[i - from][0]);
			assert.equal(registers[i][1], items[i - from][1]);
		}
	});
}
