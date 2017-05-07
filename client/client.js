


var io = require('socket.io-client');
socket = io() //can pass ip of server
var Player = require('broadway-player');
var nipplejs = require('nipplejs');
var atob = require('atob');
var $ = require('jquery')
//////////////////////////////////////
////////////////video/////////////////
//////////////////////////////////////

var player = new Player.Player({
    size: {
        width: 500,
        height: 500
    },
    useWorker: true,
    workerFile: './Decoder.js'
})

document.getElementById("video").appendChild(player.canvas);

var toUint8Array = function (parStr) {
    var raw = atob(parStr);
    var array = new Uint8Array(new ArrayBuffer(raw.length));

    Array.prototype.forEach.call(raw, function (data, index) {
        array[index] = raw.charCodeAt(index);
    })

    return array;
};


var once = true;
socket.on('video', function (video) {
    if (once) {
        console.log(video)
        once = false
    }
    player.decode(toUint8Array(video));
});

//////////////////////////////////////
////////////////piloting/////////////////
//////////////////////////////////////
var move = {
    roll: 0, //move right-left
    pitch: 0, //forward - backword
    yaw: 0, //rotate right-left
    gaz: 0 //up-down
}

var pressedKeys = {}

document.getElementById("commands").textContent = move

joy2 = nipplejs.create({
    zone: document.getElementById('videoContainer'),
    //mode: "daynmic",
    restOpacity: 110,
    size: 200,
    color: "red"
})

joy2.on('move', function (evt, data) {
    if (data.force > 1) {
        data.force = 1
    }
    move.pitch = Math.sin(data.angle.radian) * data.force * 100
    move.roll = Math.cos(data.angle.radian) * data.force * 100
    console.log(move)
    socket.emit('joyMove', move)
})


joy2.on('end', function (evt, data) {
    move.roll = 0
    move.pitch = 0
    console.log(move)

    socket.emit('joyMove', move)
})

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 87 || key == 68 || key == 65 || key == 83) {
        pressedKeys[key] = false
        switch (key) {
            case 87:
            case 83: {
                move.gaz = 0
                break
            }
            case 68:
            case 65: {
                move.yaw = 0
            }
        }
        console.log(move)
        socket.emit('keyMove', move)
    }
}

window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 87 || key == 68 || key == 65 || key == 83) {
        pressedKeys[key] = true
        Object.keys(pressedKeys).forEach(function (field) {
            if (pressedKeys[field]) {
                switch (parseInt(field)) {
                    case 87: {
                        if (move.gaz < 0) {
                            move.gaz = 0;
                        }
                        else {
                            move.gaz++
                        }
                        break
                    }
                    case 83: {
                        if (move.gaz > 0) {
                            move.gaz = 0;
                        }
                        else {
                            move.gaz -= 1
                        }
                        break
                    }
                    case 68: {
                        if (move.yaw < 0) {
                            move.yaw = 0;
                        }
                        else {
                            move.yaw++
                        }
                        break
                    }
                    case 65: {
                        if (move.yaw > 0) {
                            move.yaw = 0;
                        }
                        else {
                            move.yaw -= 1
                        }
                        break
                    }
                }
            }
        })
        console.log(move)
        socket.emit('keyMove', move)
    }
}

// var interval = setInterval(function(e) {fireEvent(e)}, 1000)
// function fireEvent(e) {
//     console.log(e)
// }


///////////////////////////////////////////////////////////////
////////////////navigate with on screen button/////////////////
///////////////////////////////////////////////////////////////



$("#up").mousedown(function (e) {
    var interval = setInterval(function () {
        if (move.gaz < 0) {
            move.gaz = 0;
        }
        else {
            move.gaz += 10
        }
        socket.emit(move)
    }, 1000)
    $("#up").mouseup(function (e) {
        clearInterval(interval)
        move.gaz = 0;
        socket.emit(move)
    })
})

$("#down").mousedown(function (e) {
    var interval = setInterval(function () {
        if (move.gaz > 0) {
            move.gaz = 0;
        }
        else {
            move.gaz -= 10
        }
        socket.emit(move)
    }, 1000)
    $("#down").mouseup(function (e) {
        clearInterval(interval)
        move.gaz = 0;
        socket.emit(move)
    })
})

$("#left").mousedown(function (e) {
    var interval = setInterval(function () {
        if (move.yaw < 0) {
            move.yaw = 0;
        }
        else {
            move.yaw += 10
        }
        socket.emit(move)
    }, 1000)
    $("#left").mouseup(function (e) {
        clearInterval(interval)
        move.yaw = 0;
        socket.emit(move)
    })
})

$("#right").mousedown(function (e) {
    var interval = setInterval(function () {
        if (move.yaw < 0) {
            move.yaw = 0;
        }
        else {
            move.yaw += 10
        }
        socket.emit(move)
    }, 1000)
    $("#right").mouseup(function (e) {
        clearInterval(interval)
        move.yaw = 0;
        socket.emit(move)
    })
})



//////////////////////////////////////
////////////////drone Events/////////////////
//////////////////////////////////////


$("#takeoff").click(function (e) {
    socket.emit('takeoff')
})

socket.on("takingOff", function () {
    startTimer()
})

$("#land").click(function (e) {
    $("#commands").text = "landing!"
    socket.emit('land')
})

socket.on("landing", function () {
    console.log("landing..........")
})

$("#stop").click(function (e) {
    $("#commands").text = "stopping!"
    socket.emit('stop')
    $("#emergency").text = "Emergency"

    //$("#emergency").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
})

$("#revcover").click(function (e) {
    $("#commands").text = "recovering.."
    socket.emit('revcover')
    $("#emergency").text = ""

})



function startTimer() {
    var count = 3;
    function updateTimer() {
        if (count > 0) {
            $("#content").fadeOut('slow', function () {
                $("#content").text(count);
                $("#content").fadeIn();
                count--;
            });

        }
        else if (count == 0) {
            $("#content").fadeOut('slow', function () {
                $("#content").text("airborne");
                $("#content").fadeIn();
                count--;
            });

        }
        else {
            $("#content").fadeOut();
            clearInterval(interval);
        }

    }
    var interval = setInterval(function () { updateTimer() }, 2000)
}


socket.on("location", function (location) {
    $("lat").text = location.latitude
    $("lng").text = location.longitude
})

socket.on("emergency", function () {
    $("#emergency").text = "Emergency"
    $("#emergency").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
})