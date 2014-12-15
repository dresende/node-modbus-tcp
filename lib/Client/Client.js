var util   = require("util");
var events = require("events");

var functions   = require("../Functions");
var exceptions  = require("../ExceptionCodes");
var ReadStream  = require("./ReadStream").ReadStream;
var WriteStream = require("./WriteStream").WriteStream;

var TRANSACTION_ID_LIMIT = 65535;

exports.Client = Client;

function Client() {
	events.EventEmitter.call(this);

	var reader        = new ReadStream();
	var writer        = new WriteStream();
	var responses     = {};

	reader.on("data", function (data) {
		if (data.hasOwnProperty("exception")) {
			if (responses.hasOwnProperty(data.transactionId)) {
				responses[data.transactionId].next(exceptions.build(data.exception));
				delete responses[data.transactionId];
				return;
			}
		} else {
			switch (data.functionCode) {
				case "READ_COILS":
				case "READ_DISCRETE_INPUTS":
				case "READ_HOLDING_REGISTERS":
				case "READ_INPUT_REGISTERS":
				case "WRITE_SINGLE_COIL":
				case "WRITE_SINGLE_REGISTER":
				case "WRITE_MULTIPLE_COILS":
				case "WRITE_MULTIPLE_REGISTERS":
					return handleData(this, data, responses);
			}
		}

		if (responses.hasOwnProperty(data.transactionId)) {
			responses[data.transactionId].next(data);
			delete responses[data.transactionId];
			return;
		}

		return this.emit("data", data);
	}.bind(this));

	reader.on("error", function (err) {
		this.emit("error", err);
	}.bind(this));

	this.transactionId = 1;

	addReadFunction(this, "readCoils", writer, responses);
	addReadFunction(this, "readDiscreteInputs", writer, responses);
	addReadFunction(this, "readHoldingRegisters", writer, responses);
	addReadFunction(this, "readInputRegisters", writer, responses);

	addWriteFunction(this, "writeSingleCoil", writer, responses);
	addWriteFunction(this, "writeSingleRegister", writer, responses);

	addWriteMultipleFunction(this, "writeMultipleCoils", writer, responses);
	addWriteMultipleFunction(this, "writeMultipleRegisters", writer, responses);

	this.pipe = function (stream) {
		stream.pipe(reader);
		writer.pipe(stream);
		return this;
	};

	this.reader = function () {
		return reader;
	};

	this.writer = function () {
		return writer;
	};

	this.write = function (data, next) {
		if (typeof next == "function" &&  typeof data.transactionId != "undefined") {
			responses[data.transactionId] = { next: next };
		}
		writer.write(data);
		return this;
	};
}

util.inherits(Client, events.EventEmitter);

function addReadFunction(obj, name, writer, responses) {
	obj[name] = function (unitId, from, to, next) {
		if (typeof next == "function") {
			responses[obj.transactionId] = { next: next, limit: to - from + 1 };
		}

		writer.write(functions[name](obj.transactionId, unitId, from, to));

		obj.transactionId = (obj.transactionId + 1) % TRANSACTION_ID_LIMIT;

		return obj;
	};
}

function addWriteFunction(obj, name, writer, responses) {
	obj[name] = function (unitId, addr, val, next) {
		if (typeof next == "function") {
			responses[obj.transactionId] = { next: next };
		}

		writer.write(functions[name](obj.transactionId, unitId, addr, val));

		obj.transactionId = (obj.transactionId + 1) % TRANSACTION_ID_LIMIT;

		return obj;
	};
}

function addWriteMultipleFunction(obj, name, writer, responses) {
	obj[name] = function (unitId, from, to, values, next) {
		if (typeof next == "function") {
			responses[obj.transactionId] = { next: next, limit: to - from + 1 };
		}

		writer.write(functions[name](obj.transactionId, unitId, from, to, values));

		obj.transactionId = (obj.transactionId + 1) % TRANSACTION_ID_LIMIT;

		return obj;
	};
}

function handleData(obj, data, responses) {
	if (!responses.hasOwnProperty(data.transactionId)) {
		var ev = data.functionCode.toLowerCase().replace(/_/g, "-");

		return obj.emit(ev, data.unitId, data.items, data);
	}

	responses[data.transactionId].next(null, data.items ? data.items.slice(0, responses[data.transactionId].limit) : undefined, data);

	delete responses[data.transactionId];
}
