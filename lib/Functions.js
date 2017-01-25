var FunctionCodes            = require("./FunctionCodes");
var READ_COILS               = require("./protocol/READ_COILS");
var READ_DISCRETE_INPUTS     = require("./protocol/READ_DISCRETE_INPUTS");
var READ_HOLDING_REGISTERS   = require("./protocol/READ_HOLDING_REGISTERS");
var READ_INPUT_REGISTERS     = require("./protocol/READ_INPUT_REGISTERS");
var WRITE_SINGLE_COIL        = require("./protocol/WRITE_SINGLE_COIL");
var WRITE_SINGLE_REGISTER    = require("./protocol/WRITE_SINGLE_REGISTER");
var WRITE_MULTIPLE_COILS     = require("./protocol/WRITE_MULTIPLE_COILS");
var WRITE_MULTIPLE_REGISTERS = require("./protocol/WRITE_MULTIPLE_REGISTERS");

exports.readCoils                      = READ_COILS.request;
exports.readCoilsResponse              = READ_COILS.response;
exports.readDiscreteInputs             = READ_DISCRETE_INPUTS.request;
exports.readDiscreteInputsResponse     = READ_DISCRETE_INPUTS.response;
exports.readHoldingRegisters           = READ_HOLDING_REGISTERS.request;
exports.readHoldingRegistersResponse   = READ_HOLDING_REGISTERS.response;
exports.readInputRegisters             = READ_INPUT_REGISTERS.request;
exports.readInputRegistersResponse     = READ_INPUT_REGISTERS.response;
exports.writeSingleCoil                = WRITE_SINGLE_COIL.request;
exports.writeSingleCoilResponse        = WRITE_SINGLE_COIL.response;
exports.writeSingleRegister            = WRITE_SINGLE_REGISTER.request;
exports.writeSingleRegisterResponse    = WRITE_SINGLE_REGISTER.response;
exports.writeMultipleCoils             = WRITE_MULTIPLE_COILS.request;
exports.writeMultipleCoilsResponse     = WRITE_MULTIPLE_COILS.response;
exports.writeMultipleRegisters         = WRITE_MULTIPLE_REGISTERS.request;
exports.writeMultipleRegistersResponse = WRITE_MULTIPLE_REGISTERS.response;

exports.exception = function (trid, unitid, fun, err) {
	return {
		transactionId : trid,
		unitId        : unitid,
		functionCode  : FunctionCodes[fun + "_EXCEPTION"],
		exceptionCode : err
	};
};
