var assert    = require("assert");
var helpers   = require("../helpers");
var client    = helpers.client();
var server    = helpers.server();
var trials    = helpers.trials();
var registers = helpers.randomBuffers();
var offset    = 30001;

helpers.pipe(server, client);

server.on("read-input-registers", function (from, to, reply) {
	return reply(null, registers.slice(from - offset, to - offset + 1));
});

describe("READ_INPUT_REGISTERS", function () {
	for (var i = 0; i < trials; i++) {
		(function () {
			var from = offset + Math.max(1, Math.floor(Math.random() * registers.length / 2));
			var to   = Math.min(offset + registers.length, from + Math.floor(Math.random() * registers.length / 2));

			it("should pass (" + from + "-" + to + ")", function () {
				return run(from, to);
			});
		})();
	}
});

function run(from, to) {
	client.readInputRegisters(10, from, to, function (err, items) {
		for (var i = from; i <= to; i++) {
			assert.equal(registers[i - offset][0], items[i - from][0]);
			assert.equal(registers[i - offset][1], items[i - from][1]);
		}
	});
}
