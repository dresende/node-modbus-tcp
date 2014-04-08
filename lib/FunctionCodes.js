var codes = {
	READ_COILS               : 1,
	READ_DISCRETE_INPUTS     : 2,
	READ_HOLDING_REGISTERS   : 3,
	READ_INPUT_REGISTERS     : 4,
	WRITE_SINGLE_COIL        : 5,
	WRITE_SINGLE_REGISTER    : 6,
	WRITE_MULTIPLE_COILS     : 15,
	WRITE_MULTIPLE_REGISTERS : 16
};

for (var k in codes) {
	codes[k + "_EXCEPTION"] = codes[k] + 128;
}

for (var k in codes) {
	exports[k] = codes[k];
}

exports.lookup = function (val) {
	for (var k in codes) {
		if (val == codes[k]) {
			return k;
		}
	}

	return val;
};
