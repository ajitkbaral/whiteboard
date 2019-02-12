var socket = io.connect();
users = [];
/* Login Form */

// Get the modal
var loginModal = document.getElementById('loginModal');
loginModal.style.display = 'block';

//Get whiteboard
var whiteboard = document.getElementById('whiteboard');

var loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    socket.emit('new user', loginForm.username.value, function(data) {
        loginModal.style.display = 'none';
        whiteboard.style.display = 'block';
    });

});


socket.on('get users', function(data) {
    users = data;
    document.getElementById('open-chat-box').innerHTML = "Open Chat Box ("+users.length+")";
});

// When the user clicks anywhere outside of the modal, close it
/*window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
}*/



/* White Board */
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var dragging = false;

var radius = 5;

points = [];


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.lineWidth = 2*radius;


var putPoint = function(e) {
    if(dragging) {
        context.lineTo(e.clientX, e.clientY);
        context.stroke();
        context.beginPath();
        context.arc(e.clientX, e.clientY, radius, 0, Math.PI*2);
        context.fill(); 
        context.beginPath();
        context.moveTo(e.clientX, e.clientY);

        var position = {x: e.clientX, y: e.clientY};
        points.push(position);
    }
}

var engage = function(e) {
    dragging = true;
    putPoint(e);
}

var disengage = function() {
    dragging = false;
    context.beginPath();

    //Sending data to socket
    socket.emit('draw', {points: points, socketColor: socketColor, socketRadius: radius});
    points = [];
}

canvas.addEventListener('mousedown', engage);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', disengage);

//Draw from socket
function drawFromSocket(position, radius) {

    context.lineWidth = 2*radius;

    context.lineTo(position.x, position.y);
    context.stroke();
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.moveTo(position.x, position.y);
}

//Reveive the data from socket
socket.on('new draw', function(data) {
    //Setting the color coming from socket
    setContextStyleColor(data.socketColor);
    //Drawing from socket points
    for(var i=0; i<data.points.length; i++) {
        drawFromSocket(data.points[i], data.socketRadius);
    }
    //Restore the color 
    context.beginPath();
    setContextStyleColor(activeColor);
    context.lineWidth = 2*radius;
});

function setContextStyleColor(color) {
    context.fillStyle = color;
    context.strokeStyle = color;
}

