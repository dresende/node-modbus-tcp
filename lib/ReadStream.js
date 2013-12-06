var FunctionCodes = require("./FunctionCodes");
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

		if (this.pending.length < pkg_len) return next();

		var data = this.pending.slice(8, pkg_len);
		var pkg  = {
			transactionId : this.pending.readUInt16BE(0),
			protocol      : this.pending.readUInt16BE(2),
			length        : pkg_len,
			unit          : this.pending.readUInt8(6),
			functionCode  : this.pending.readUInt8(7)
		};

		this.pending = this.pending.slice(pkg_len);

		switch (pkg.functionCode) {
			case FunctionCodes.HOLDING_REGISTERS:
				pkg.registers = data.readUInt8(0) / 2;
				pkg.data = [];
				for (var i = 0; i < pkg.registers; i++) {
					pkg.data.push(data.readInt16BE(1 + (i * 2), true));
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
