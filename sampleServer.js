var net = require('net');
var modbus = require('modbus-tcp');
var modbusServer = new modbus.Server();
const port = 502;

var tcpServer = net.createServer();

tcpServer.listen(port,function(){
    console.log('TCP Socket bound to port '+port);
});

tcpServer.on('connection', function(socket){
    console.log('client has connected');
    modbusServer.pipe(socket);

    socket.on('error', function(e){
        console.log('Connection error: '+e);
        socket.destroy();
    });

    socket.on('close', function(e){
        console.log('Client has closed connection.');
    });
});

modbusServer.on('read-holding-registers', readHoldingRegisters);
modbusServer.on('read-coils',readCoils);
modbusServer.on('write-multiple-registers',writeRegisters);

function readHoldingRegisters(from,to,reply) {
    console.log('Read holding registers '+from+'-'+to);
    var values = [1,6,3,9]; // sample values just to see if it works.
    return reply(null,bufferify(values));
}

function readCoils(from,to,reply) {
    console.log('Read coils '+from+'-'+to);
    var values = [2,0,8]; // anything greater than zero is received as a 1
    return reply(null,values);
}

function writeRegisters(from,to,items,reply) {
    console.log('Write registers '+from+'-'+to);
    console.log('  items:'+items);
    reply();
}

function bufferify(itemsArray) {
    // When client reads values, have to supply an 
    // array of Buffers (not just an array of numbers) to the reply function.
    var n = itemsArray.length;
    var registers = [];
    for (var i=0; i<n; i++) {
        registers[i] = Buffer.alloc(2);
        registers[i].writeInt16BE(itemsArray[i],0);
    }
    return registers;
}