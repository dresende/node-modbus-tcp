var FunctionCodes = require("../FunctionCodes");
var stream        = require("stream");

exports.ReadStream = ReadStream;

function ReadStream() {
	stream.Transform.call(this, { objectMode: true });

	this.pending = null;
}

ReadStream.prototype = Object.create(stream.Transform.prototype, {
	constructor: { value: ReadStream }
});

ReadStream.prototype._transform = function (chunk, encoding, next) {
	if (!chunk) {
		return;
	}
	if (typeof chunk == "string") {
		chunk = new Buffer(chunk, "binary");
	} else if (!Buffer.isBuffer(chunk)) {
		this.emit("error", new Error("Unsupported data mode"));
	}

	if (this.pending === null) {
		this.pending = chunk;
	} else {
		this.pending = Buffer.concat([ this.pending, chunk ]);
	}

	while (this.pending.length >= 6) {
		var pkg_len = this.pending.readUInt16BE(4) + 6;

		if (this.pending.length < 8)       return next(); // safety precaution
		if (this.pending.length < pkg_len) return next(); // not all data yet

		var data = this.pending.slice(8, pkg_len);
		var pkg  = {
			transactionId : this.pending.readUInt16BE(0),
			protocol      : this.pending.readUInt16BE(2),
			length        : pkg_len,
			unitId        : this.pending.readUInt8(6),
			functionCode  : FunctionCodes.lookup(this.pending.readUInt8(7))
		};

		this.pending = this.pending.slice(pkg_len);

		if (typeof pkg.functionCode != "string") {
			pkg.functionCode = "" + pkg.functionCode;
		}

		if (pkg.functionCode == "0") {
			pkg.data = data;
		} else if (pkg.functionCode.match(/_EXCEPTION$/)) {
			pkg.functionCode = pkg.functionCode.substr(0, pkg.functionCode.length - 10);
			pkg.exception    = data.readUInt8(0);
		} else {
			switch (pkg.functionCode) {
				case 'READ_COILS':
					pkg.items = [];

					for (var i = 1; i < data.length; i++) {
						for (var j = 0; j < 8; j++) {
							pkg.items.push((data[i] >> j) & 0x1);
						}
					}
					break;
				case 'READ_DISCRETE_INPUTS':
					pkg.items = [];

					for (var i = 1; i < data.length; i++) {
						for (var j = 0; j < 8; j++) {
							pkg.items.push((data[i] >> j) & 0x1);
						}
					}
					break;
				case 'READ_HOLDING_REGISTERS':
					var cnt = data.readUInt8(0) / 2;

					pkg.items = [];

					for (var i = 0; i < cnt; i++) {
						pkg.items.push(new Buffer([ data[(i * 2) + 1], data[(i * 2) + 2] ]));
					}
					break;
				case 'READ_INPUT_REGISTERS':
					var cnt = data.readUInt8(0) / 2;

					pkg.items = [];

					for (var i = 0; i < cnt; i++) {
						pkg.items.push(new Buffer([ data[(i * 2) + 1], data[(i * 2) + 2] ]));
					}
					break;
				case 'WRITE_SINGLE_COIL':
					pkg.address = data.readUInt16BE(0);
					pkg.value   = (data[2] == 0xFF && data[3] == 0x00 ? 1 : 0);
					break;
				case 'WRITE_SINGLE_REGISTER':
					pkg.address = data.readUInt16BE(0);
					pkg.value   = new Buffer([ data[2], data[3] ]);
					break;
				case 'WRITE_MULTIPLE_COILS':
					pkg.from = data.readUInt16BE(0);
					pkg.to   = data.readUInt16BE(2) + pkg.from - 1;
					break;
				case 'WRITE_MULTIPLE_REGISTERS':
					pkg.from = data.readUInt16BE(0);
					pkg.to   = data.readUInt16BE(2) + pkg.from - 1;
					break;
				default:
					pkg.data = data;
			}
		}

		this.push(pkg);
	}

	return next();
};

ReadStream.prototype._write = function () {
	this._transform.apply(this, arguments);
};

ReadStream.prototype.end = function () {
	this._transform.apply(this, arguments);
	this.emit("end");
};
