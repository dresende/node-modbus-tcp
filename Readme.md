## Modbus TCP/IP Stream

[![Build Status](https://secure.travis-ci.org/dresende/node-modbus-tcp.png?branch=master)](http://travis-ci.org/dresende/node-modbus-tcp)

This is a very simple module that uses NodeJS Streams2 to read Modbus TCP data and convert it to JSON and vice-versa.

## Upgrade

If you're just starting or just trying to use this library, I advise you to try [modbus-stream](http://github.com/node-modbus/stream). It's more complete (it supports all standard function codes) and it was designed to work with TCP, RTU and ASCII modes.

## Install

```sh
npm install modbus-tcp
```

## Example

```js
var modbus = require("modbus-tcp");
var client = new modbus.Client();
var server = new modbus.Server();

// link client and server streams together
client.writer().pipe(server.reader());
server.writer().pipe(client.reader());
// if you have a socket (stream) you can just
// call client.pipe(socket) or server.pipe(socket)

server.on("read-coils", function (from, to, reply) {
    return reply(null, [ 1, 0, 1, 1 ]);
});

// read coils from unit id = 0, from address 10 to 13
client.readCoils(0, 10, 13, function (err, coils) {
    // coils = [ 1, 0, 1, 1 ]
});
```

## Client Methods

All of the following read methods have the form `method(unitId, from, to, next)` and write methods have the form `method(unitId, addr, val, next)`, where `next` is an **optional** function called if the server replies (with the same transactionId) to the sent message.

- readCoils
- readDiscreteInputs
- readHoldingRegisters
- readInputRegisters
- writeSingleCoil
- writeSingleRegister
- writeMultipleCoils
- writeMultipleRegisters

Addresses are exactly as is in protocol, so if you see a paper talking about address `40001` this usually means first record address of that function so it means address `0`.

## Server Events

- read-coils
- read-discrete-inputs
- read-holding-registers
- read-input-registers
- write-single-coil
- write-single-register
- write-multiple-coils
- write-multiple-registers
- data

This last event is triggered when an unknown function code is received.
