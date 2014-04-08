var util   = require("util");
var events = require("events");

var functions   = require("../Functions");
var ReadStream  = require("./ReadStream").ReadStream;
var WriteStream = require("./WriteStream").WriteStream;

exports.Server = Server;

function Server() {
	events.EventEmitter.call(this);

	var reader = new ReadStream();
	var writer = new WriteStream();

	reader.on("data", function (data) {
		switch (data.functionCode) {
			case "READ_COILS":
			case "READ_DISCRETE_INPUTS":
			case "READ_HOLDING_REGISTERS":
			case "READ_INPUT_REGISTERS":
				return handleReadData(this, data, writer);
			case "WRITE_SINGLE_COIL":
			case "WRITE_SINGLE_REGISTER":
				return handleWriteData(this, data, writer);
			case "WRITE_MULTIPLE_COILS":
			case "WRITE_MULTIPLE_REGISTERS":
				return handleWriteMultipleData(this, data, writer);
				break;
			default:
				this.emit("data", data);
		}
	}.bind(this));

	this.pipe = function () {
		if (arguments.length === 0) {
			return reader;
		}

		writer.pipe(arguments[0]);
		return this;
	};
}

util.inherits(Server, events.EventEmitter);

function handleReadData(obj, data, writer) {
	var ev  = data.functionCode.toLowerCase().replace(/_/g, "-");
	var fun = ev.replace(/\-([a-z])/g, function (m, c) { return c.toUpperCase(); }) + "Response";

	obj.emit(ev, data.from, data.to, function reply(err, items) {
		if (err) {
			return writer.write(functions.exception(data.functionCode, err));
		}
		return writer.write(functions[fun](data.transactionId, data.unitId, items));
	}, data);
}

function handleWriteData(obj, data, writer) {
	var ev  = data.functionCode.toLowerCase().replace(/_/g, "-");
	var fun = ev.replace(/\-([a-z])/g, function (m, c) { return c.toUpperCase(); }) + "Response";

	obj.emit(ev, data.address, data.value, function reply(err, val, addr) {
		if (err) {
			return writer.write(functions.exception(data.functionCode, err));
		}
		return writer.write(functions[fun](data.transactionId, data.unitId, addr || data.address, val || data.value));
	}, data);
}

function handleWriteMultipleData(obj, data, writer) {
	var ev  = data.functionCode.toLowerCase().replace(/_/g, "-");
	var fun = ev.replace(/\-([a-z])/g, function (m, c) { return c.toUpperCase(); }) + "Response";

	obj.emit(ev, data.from, data.to, data.items, function reply(err, to) {
		if (err) {
			return writer.write(functions.exception(data.functionCode, err));
		}
		return writer.write(functions[fun](data.transactionId, data.unitId, data.from, to || data.to));
	}, data);
}
