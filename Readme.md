## Modbus TCP/IP Stream

[![Build Status](https://secure.travis-ci.org/dresende/node-modbus-tcp.png?branch=master)](http://travis-ci.org/dresende/node-modbus-tcp)

This is a very simple module that uses NodeJS Streams2 to read Modbus TCP data and convert it to JSON and vice-versa.

## Install

```sh
npm install modbus-tcp
```

## Example

```js
var net    = require("net");
var modbus = require("modbus-tcp");
var reader = new modbus.ClientReadStream;
var writer = new modbus.ClientWriteStream;

var client = net.connect(502, "1.2.3,4");
client.on("connect", function () {
    // connect streams together (writer -> client -> reader)
    client.pipe(reader);
    writer.pipe(client);

    reader.on("data", function (pkg) {
        console.log(pkg); // { functionCode: ..., protocol: ... }
    });

    writer.write({
        functionCode : modbus.FunctionCodes.HOLDING_REGISTERS,
        data : [ 4, 0, 0, 0, 3 ] // 4 bytes, start 0x0000, length 0x0003
    });
});
```

## TODO

- Basic support of more functions, specially write functions
- Support for exceptions
- Support for server streams
