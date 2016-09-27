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

		switch (pkg.functionCode) {
			case 'READ_COILS':
				pkg.from = data.readUInt16BE(0);
				pkg.to = data.readUInt16BE(2) + pkg.from - 1;
				break;
			case 'READ_DISCRETE_INPUTS':
				pkg.from = data.readUInt16BE(0);
				pkg.to = data.readUInt16BE(2) + pkg.from - 1;
				break;
			case 'READ_HOLDING_REGISTERS':
				pkg.from = data.readUInt16BE(0);
				pkg.to = data.readUInt16BE(2) + pkg.from - 1;
				break;
			case 'READ_INPUT_REGISTERS':
				pkg.from = data.readUInt16BE(0);
				pkg.to = data.readUInt16BE(2) + pkg.from - 1;
				break;
			case 'WRITE_SINGLE_COIL':
				pkg.address = data.readUInt16BE(0);
				pkg.value   = new Buffer([ data[2], data[3] ]);
				break;
			case 'WRITE_SINGLE_REGISTER':
				pkg.address = data.readUInt16BE(0);
				pkg.value   = new Buffer([ data[2], data[3] ]);
				break;
			case 'WRITE_MULTIPLE_COILS':
				pkg.from   = data.readUInt16BE(0);
				pkg.to     = data.readUInt16BE(2) + pkg.from - 1;
				pkg.items  = [];

				for (var i = 5; i < data.length; i++) {
					for (var j = 0; j < 8; j++) {
						pkg.items.push((data[i] >> j) & 0x1);
						if (pkg.items.length >= pkg.to - pkg.from + 1) {
							break;
						}
					}
				}
				break;
			case 'WRITE_MULTIPLE_REGISTERS':
				pkg.from   = data.readUInt16BE(0);
				pkg.to     = data.readUInt16BE(2) + pkg.from - 1;
				pkg.items  = [];
				for (var i = 5; i < data.length - 1; i += 2) {
					pkg.items.push(new Buffer([ data[i], data[i + 1] ]));
				}
				break;
			default:
				pkg.data = data;
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
