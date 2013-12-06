## Modbus TCP/IP Stream

[![Build Status](https://secure.travis-ci.org/dresende/node-modbus-tcp.png?branch=master)](http://travis-ci.org/dresende/node-modbus-tcp)

This is a very simple module that uses NodeJS Streams2 to read Modbus TCP data and convert it to JSON and vice-versa.

## Install

```sh
npm install modbus-tcp
```

## Example

```js
var modbus = require("modbus-tcp");
var reader = new modbus.ReadStream;
var writer = new modbus.WriteStream;

// ...
server.on("connection", function (socket) {
    socket.pipe(reader);
    writer.pipe(socket);

    reader.on("data", function (pkg) {
        console.log(pkg); // { functionCode: ..., protocol: ... }
    });

    writer.write({
        functionCode : modbus.FunctionCodes.HOLDING_REGISTERS,
        data : new Buffer([ 4, 0, 0, 0, 3 ]) // 4 bytes, start 0x0000, length 0x0003
    }); // will write to socket
});
```
