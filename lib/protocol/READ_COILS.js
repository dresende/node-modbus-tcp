var Package  = require("./tools").Package;
var packbits = require("./tools").packbits;
var pack     = require("./tools").pack2uint16;

exports.request = function (transactionId, unitId, startAddress, endAddress) {
	return new Package(
		transactionId,
		unitId,
		"READ_COILS",
		pack(startAddress, endAddress - startAddress + 1)
	);
};
exports.response = function (transactionId, unitId, status) {
	return new Package(transactionId, unitId, "READ_COILS", packbits(status));
};
