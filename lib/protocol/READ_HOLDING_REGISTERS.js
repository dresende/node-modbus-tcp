var Package = require("./tools").Package;
var pack    = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, startAddress, endAddress) {
	return new Package(
		transactionId,
		unitId,
		"READ_HOLDING_REGISTERS",
		pack(startAddress, endAddress - startAddress + 1)
	);
};
exports.response = function (transactionId, unitId, registers) {
	var buf = new Buffer((registers.length * 2) + 1);

	buf.writeUInt8(registers.length * 2, 0);

	for (var i = 0; i < registers.length; i++) {
		buf.writeInt16BE(registers[i], (i * 2) + 1);
	}

	return new Package(transactionId, unitId, "READ_HOLDING_REGISTERS", buf);
};
