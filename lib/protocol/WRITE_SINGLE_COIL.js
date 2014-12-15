var Package = require("./tools").Package;
var pack    = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, address, value) {
	var buf = new Buffer(4);

	buf.writeUInt16BE(address, 0);

	buf[2] = (value ? 0xFF : 0x00);
	buf[3] = 0x00;

	return new Package(
		transactionId,
		unitId,
		"WRITE_SINGLE_COIL",
		buf
	);
};
exports.response = exports.request;
