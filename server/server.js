var path = require('path')
var atob = require('atob')
var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var arDrone = require('node-bebop');

var drone = arDrone.createClient();
var video = drone.getVideoStream();


app.use(express.static(path.join(__dirname + './../client')))

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + './../client/client.html'))
});

// drone.connect(function() {
//   console.log("connected")
//   io.sockets.emit("connected")
// })

io.on('connection', function(socket){
//   console.log('a user connected');
//   video.on('data', function (data) {
//     socket.emit('video', data.toString('base64'))
//   });
//   drone.on("emergency", function(){

//})
//   socket.on('joyMove', function(move){
//     
// drone.Piloting.pcmd (true, ...move, 0)
// console.log(data)
//   })
//   socket.on('keyMove', function(data){
//     console.log(data)
//   })
//  socket.on('takeoff', function () {
//         console.log("takeoff")
//         socket.emit("takingOff")
//         Piloting.flatTrim()
//         setTimeout(function() {
//         drone.takeoff()
//         }, 3000)
//     })
//     socket.on('revcover', function () {
//         console.log("revcover")
//         drone.disableEmergency()
//         // ref.emergency = false; 
//         // control.ref(ref);
//         // control.flush();
//     })
//     socket.on('land', function () {
//         console.log("land")
//          drone.on("landing", funciton() {
//            socket.emit("landing")
//          })
//         // ref.fly = false;
//         // control.ref(ref);
//         // control.flush();

//         drone.stop()
//         drone.land()
//     })
//           drone.on("PositionChanged", function (location) {
// socket.emit("location", location)


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    