var canvas, context;

var dragging = false;

var dragStartLocation, snapShot;

var radius = 1;

var socket = io.connect();

function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapShot() {
    snapShot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapShot() {
    context.putImageData(snapShot, 0, 0);
}

function drawLine(position) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y); 
    context.stroke();
}

function dragStart(event) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapShot();
}

function drag(event) {
    var position;
    if(dragging) {
        restoreSnapShot();
        position = getCanvasCoordinates(event);
        drawLine(position)
    }
}

function dragStop(event) {
    dragging = false;
    restoreSnapShot();
    var position = getCanvasCoordinates(event);
    drawLine(position);

    //Emit
    socket.emit('draw line', {start: dragStartLocation, stop: position});
}


function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.lineWidth = 2*radius;
    context.lineCap = 'round';

    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
}

socket.on('new line', function(data) {
    drawLineFromSocket(data.start, data.stop);
});

function drawLineFromSocket(start, stop) {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(stop.x, stop.y); 
    context.stroke();
}

window.addEventListener('load', init, false);
