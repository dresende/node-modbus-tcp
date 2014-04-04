var helpers = require("../helpers");
var modbus  = require("../../");

var tests = [
	[
		"Basic message",
		new Buffer([ 0, 1, 0, 2, 0, 7, 4, 3, 4, 0, 10, 0, 11 ]),
		{ transactionId: 1, protocol: 2, length: 13, unit: 4, functionCode: 'READ_HOLDING_REGISTERS', registers: 2, data: [ 10, 11 ] }
	],
	[
		"Splitted message",
		new Buffer([ 0, 5, 0, 4, 0, 9, 4, 3 ]),
		new Buffer([ 6, 0, 20, 0, 30 ]),
		new Buffer([ 0, 40 ]),
		{ transactionId: 5, protocol: 4, length: 15, unit: 4, functionCode: 'READ_HOLDING_REGISTERS', registers: 3, data: [ 20, 30, 40 ] }
	],
	[
		"Unknown message",
		new Buffer([ 0, 2, 0, 0, 0, 7, 4, 250 ]),
		new Buffer([ 5, 4, 3, 2, 1 ]),
		{ transactionId: 2, protocol: 0, length: 13, unit: 4, functionCode: 250, data: new Buffer([ 5, 4, 3, 2, 1 ]) }
	]
];

for (var i = 0; i < tests.length; i++) {
	var desc = tests[i].shift();
	var res  = tests[i].pop();

	helpers.addStreamTest(modbus.ClientReadStream, desc, tests[i], res);
}
