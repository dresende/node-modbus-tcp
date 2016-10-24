var assert  = require("assert");
var helpers = require("../helpers");
var client  = helpers.client();
var server  = helpers.server();
var trials  = helpers.trials();

helpers.pipe(server, client);

server.on("write-single-register", function (addr, val, reply) {
	if (addr % 7 === 0) {
		return reply(helpers.modbus.Exceptions("ILLEGAL_DATA_ADDRESS"));
	}
	return reply();
});

describe("WRITE_SINGLE_REGISTER", function () {
	for (var i = 0; i < trials; i++) {
		(function () {
			var addr = Math.round(Math.random() * 1000) + 40001;

			it("should pass (" + addr + ")", function () {
				return run(addr);
			});
		})();
	}
});

function run(addr) {
	client.writeSingleRegister(10, addr, new Buffer(2), function (err) {
		if (addr % 7 === 0) {
			assert.equal(err instanceof Error, true);
		} else {
			assert.equal(err, null);
		}
	});
}
