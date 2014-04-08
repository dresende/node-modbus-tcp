var codes = {
	ILLEGAL_FUNCTION                        : 1,
	ILLEGAL_DATA_ADDRESS                    : 2,
	ILLEGAL_DATA_VALUE                      : 3,
	SERVER_DEVICE_FAILURE                   : 4,
	ACKNOWLEDGE                             : 5,
	SERVER_DEVICE_BUSY                      : 6,
	NEGATIVE_ACKNOWLEDGE                    : 7,
	MEMORY_PARITY_ERROR                     : 8,
	GATEWAY_PATH_UNAVAILABLE                : 10,
	GATEWAY_TARGET_DEVICE_FAILED_TO_RESPOND : 11
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

exports.build = function (val) {
	var msg = this.lookup(val);
	var err = new Error(msg);

	err.code = val;

	return err;
};
