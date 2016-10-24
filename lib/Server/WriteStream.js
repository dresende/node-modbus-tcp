var stream = require("stream");

exports.WriteStream = WriteStream;

function WriteStream() {
	stream.Transform.call(this, { objectMode : true });

	this.transactionId = 0;
}

WriteStream.prototype = Object.create(stream.Transform.prototype, {
	constructor: { value: WriteStream }
});

WriteStream.prototype._transform = function (chunk, encoding, next) {
	if (typeof chunk != "object" || chunk === null) {
		this.emit("error", new Error("Unsupported data mode"));
	}

	if (typeof chunk.toJSON == "function") {
		chunk = chunk.toJSON();
	}

	if (!chunk.hasOwnProperty("functionCode")) {
		this.emit("error", new Error("Missing functionCode"));
	}

	if (!chunk.data) {
		chunk.data = new Buffer(0);
	} else if (!Buffer.isBuffer(chunk.data)) {
		chunk.data = new Buffer(chunk.data);
	}

	if (chunk.hasOwnProperty("exceptionCode")) {
		chunk.data = new Buffer(1);
		chunk.data.writeUInt8(parseInt(chunk.exceptionCode.code, 10), 0);
	}

	var req = new Buffer(8 + chunk.data.length);

	req.writeUInt16BE(chunk.hasOwnProperty("transactionId") ? chunk.transactionId : ++this.transactionId, 0);
	req.writeUInt16BE(chunk.protocol || 0, 2);
	req.writeUInt16BE(chunk.data.length + 2, 4);
	req.writeUInt8(chunk.unitId || 0, 6);
	req.writeUInt8(chunk.functionCode, 7);

	chunk.data.copy(req, 8);
	this.push(req);
	next();
};

WriteStream.prototype._write = function () {
	this._transform.apply(this, arguments);
};

WriteStream.prototype.end = function () {
	this._transform.apply(this, arguments);
	this.emit("end");
};
