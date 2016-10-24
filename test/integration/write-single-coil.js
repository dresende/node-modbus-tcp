var assert  = require("assert");
var helpers = require("../helpers");
var client  = helpers.client();
var server  = helpers.server();
var trials  = helpers.trials();

helpers.pipe(server, client);

server.on("write-single-coil", function (addr, val, reply) {
	if (addr % 3 === 0) {
		return reply(helpers.modbus.Exceptions("ILLEGAL_DATA_ADDRESS"));
	}
	return reply();
});

describe("WRITE_SINGLE_COIL", function () {
	for (var i = 0; i < trials; i++) {
		(function () {
			var addr = Math.round(Math.random() * 1000) + 1;

			it("should pass (" + addr + ")", function () {
				return run(addr);
			});
		})();
	}
});

function run(addr) {
	client.writeSingleCoil(10, addr, 1, function (err) {
		if (addr % 3 === 0) {
			assert.equal(err instanceof Error, true);
		} else {
			assert.equal(err, null);
		}
	});
}
