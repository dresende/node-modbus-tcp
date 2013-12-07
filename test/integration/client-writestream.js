var modbus = require("../../");
var assert = require("assert");

var tests = [
	[
		"Basic message",
		{ transactionId: 1, protocol: 2, unit: 4, functionCode: 3, data: [ 10, 11 ] },
		new Buffer([ 0, 1, 0, 2, 0, 4, 0, 3, 10, 11 ])
	]
];

for (var i = 0; i < tests.length; i++) {
	addTest(
		tests[i][0],
		tests[i][1],
		tests[i][2]
	);
}

function addTest(description, data, result) {
	describe(description, function () {
		it("should pass", function (done) {
			var stream = new modbus.ClientWriteStream();

			stream.on("data", function (data) {
				assert.deepEqual(data, result);

				return done();
			});

			return stream.write(data);
		});
	});
}
