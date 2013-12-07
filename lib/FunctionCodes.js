var codes = {
	READ_HOLDING_REGISTERS : 3
};

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
