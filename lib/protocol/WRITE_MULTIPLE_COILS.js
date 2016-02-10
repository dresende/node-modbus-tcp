var Package  = require("./tools").Package;
var packbits = require("./tools").packbits;
var pack     = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, startAddress, endAddress, status) {
	var bits = packbits(status);
	var buf = new Buffer(bits.length + 5);

	buf.writeUInt16BE(startAddress, 0);
	buf.writeUInt16BE(endAddress - startAddress + 1, 2);
	buf.writeUInt8(Math.ceil((endAddress - startAddress + 1) / 8), 4);
	bits.copy(buf, 5);

	return new Package(
		transactionId,
		unitId,
		"WRITE_MULTIPLE_COILS",
		buf
	);
};

exports.response = function (transactionId, unitId, startAddress, endAddress) {
	return new Package(
		transactionId,
		unitId,
		"WRITE_MULTIPLE_COILS",
		pack(startAddress, endAddress - startAddress + 1)
	);
};
