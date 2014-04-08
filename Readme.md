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
var client = new modbus.Client();
var server = new modbus.Server();

// link client and server streams together
client.pipe(server.pipe());
server.pipe(client.pipe());

server.on("read-coils", function (from, to, reply) {
    return reply(null, [ 1, 0, 1, 1 ]);
});

// read coils from unit id = 0, from address 10 to 13
client.readCoils(0, 10, 13, function (err, coils) {
    // coils = [ 1, 0, 1, 1 ]
});
```
