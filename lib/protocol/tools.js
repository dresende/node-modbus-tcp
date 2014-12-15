var FunctionCodes = require("../FunctionCodes");

exports.Package = Package;

exports.pack2uint16 = pack2uint16;
exports.packbits    = packbits;

function Package(transactionId, unitId, code, data) {
	this.transactionId = transactionId;
	this.toJSON        = function () {
		return {
			transactionId : transactionId,
			unitId        : unitId,
			functionCode  : FunctionCodes[code] || code,
			data          : data
		};
	};
}

function pack2uint16(b1, b2) {
	var buf = new Buffer(4);

	buf.writeUInt16BE(b1, 0);
	buf.writeUInt16BE(b2, 2);

	return buf;
}

function packbits(bits) {
	var len = Math.ceil(bits.length / 8);
	var buf = new Buffer(len + 1), i;

	buf.fill(0x0);
	buf[0] = len;

	for (var index = 0; index < bits.length; index++) {
		i = Math.floor(index / 8) + 1;

		buf[i] >>= 1;
		if (bits[index]) {
			buf[i] |= 0x80;
		}
	}

	i = bits.length - (Math.floor(bits.length / 8) * 8);
	if (i > 0) {
		i = 8 - i;
		while (i > 0) {
			buf[buf.length - 1] >>= 1;
			i -= 1;
		}
	}

	return buf;
}
