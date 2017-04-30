

var config = require('./../config.js')
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var express = require('express')
var app = express()

app.use(express.static('./../client'))
app.get('/', function (req, res) {
  res.sendFile('./client/client.html')
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
});

server.bind(config.PORT, config.HOST);