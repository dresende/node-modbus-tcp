var Package = require("./tools").Package;
var pack    = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, address, value) {
	var buf = new Buffer(4);

	buf.writeUInt16BE(address, 0);
	value.copy(buf, 2, 0, 2);

	return new Package(
		transactionId,
		unitId,
		"WRITE_SINGLE_REGISTER",
		buf
	);
};
exports.response = exports.request;
