var assert  = require("assert");
var helpers = require("../helpers");
var client  = helpers.client();
var server  = helpers.server();
var trials  = helpers.trials();

helpers.pipe(server, client);

server.on("data", function (data) {
	var pkg = new helpers.modbus.Package(data.transactionId, data.unitId, data.functionCode, data.data);

	return server.write(data);
});

describe("READ_WRITE_DATA", function () {
	for (var i = 0; i < trials; i++) {
		(function () {
			it("should pass", function () {
				return run();
			});
		})();
	}
});

function run() {
	var opt = {
		transactionId : Math.round(Math.random() * 1000),
		unitId        : Math.round(Math.random() * 200),
		functionCode  : 50 + Math.round(Math.random() * 50),
		data          : new Buffer(50)
	};
	var pkg = new helpers.modbus.Package(opt.transactionId, opt.unitId, opt.functionCode, opt.data);

	client.write(pkg, function (data) {
		assert.equal(opt.transactionId, data.transactionId);
		assert.equal(opt.unitId, data.unitId);
		assert.equal(opt.functionCode, data.functionCode);
		assert.equal(opt.data.length, data.data.length);

		for (var i = 0; i < opt.data.length; i++) {
			assert.equal(opt.data[i], data.data[i]);
		}
	});
}
