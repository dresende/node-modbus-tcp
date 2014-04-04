var helpers = require("../helpers");
var modbus  = require("../../");

var tests = [
	[
		"Basic message",
		{ transactionId: 1, protocol: 2, unit: 4, functionCode: 3, data: [ 10, 11 ] },
		new Buffer([ 0, 1, 0, 2, 0, 4, 0, 3, 10, 11 ])
	]
];

for (var i = 0; i < tests.length; i++) {
	helpers.addStreamTest(modbus.ClientWriteStream, tests[i][0], tests[i][1], tests[i][2]);
}
