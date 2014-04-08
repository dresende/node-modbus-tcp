var modbus  = require("../");

exports.modbus = modbus;

exports.trials = function () {
	return require("./run").trials();
};

exports.client = function () {
	return new modbus.Client();
};

exports.server = function () {
	return new modbus.Server();
};

exports.pipe = function (stream1, stream2) {
	stream1.pipe(stream2.pipe());
	stream2.pipe(stream1.pipe());
};

exports.randomBits = function () {
	var bits = [];

	for (var i = 0; i < 100; i++) {
		bits.push(Math.random() > 0.5 ? 1 : 0);
	}

	return bits;
};

exports.randomBuffers = function () {
	var bufs = [];

	for (var i = 0; i < 100; i++) {
		bufs.push(new Buffer(2));
	}

	return bufs;
};
