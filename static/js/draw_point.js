var canvas, context;

var dragging = false;

var radius = 1;

var freeStyleButton, lineButton;

points = [];

var socket = io.connect();

function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}


function init() {
    canvas = document.getElementById('canvas');

    context = canvas.getContext('2d');
    context.lineWidth = 2*radius;
    context.lineCap = 'round';

    //For Free Style
    canvas.addEventListener('mousedown', engage, false);
    canvas.addEventListener('mousemove', putPoint, false);
    canvas.addEventListener('mouseup', disengage, false);

    freeStyleButton = document.getElementById('freestyle');
    freeStyleButton.addEventListener('click', freeStyleButtonClick, false);

    lineButton = document.getElementById('line');
    lineButton.addEventListener('click', lineButtonClick, false);

}

/* Start - Draw Point */

//on freestyle click
function freeStyleButtonClick(e) {

    lineButton.classList.remove('btn-success');
    lineButton.classList.add('btn-primary');
    freeStyleButton.classList.add('btn-success');

    canvas.addEventListener('mousedown', engage, false);
    canvas.addEventListener('mousemove', putPoint, false);
    canvas.addEventListener('mouseup', disengage, false);

    canvas.removeEventListener('mousedown', dragStart, false);
    canvas.removeEventListener('mousemove', drag, false);
    canvas.removeEventListener('mouseup', dragStop, false);

}

var putPoint = function(e) {
    if(dragging) {
        var position = getCanvasCoordinates(e);
        drawPoint(position);
    }
}

var engage = function(e) {
    dragging = true;
    putPoint(e);
}

var disengage = function(e) {
    dragging = false;
    context.beginPath();

    socket.emit('draw points', {points: points});
    points = [];
}

function drawPoint(position) {
    context.lineTo(position.x, position.y);
    context.stroke();
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.moveTo(position.x, position.y);

    points.push(position);
}

function drawPointFromSocket(position) {
    context.lineTo(position.x, position.y);
    context.stroke();
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI*2);
    context.fill();
    context.beginPath();
    context.moveTo(position.x, position.y);
}

socket.on('new draw points', function(data) {
    for(var i=0; i<data.points.length; i++) {
        drawPointFromSocket(data.points[i]);
    }
    context.beginPath();
});

/* End - Draw Point*/


/* Start - Draw Line */

var dragStartLocation, snapShot;

//on line click
function lineButtonClick(e) {

    freeStyleButton.classList.remove('btn-success');
    freeStyleButton.classList.add('btn-primary');
    lineButton.classList.add('btn-success');

    canvas.removeEventListener('mousedown', engage, false);
    canvas.removeEventListener('mousemove', putPoint, false);
    canvas.removeEventListener('mouseup', disengage, false);

    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);

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

socket.on('new line', function(data) {
    drawLineFromSocket(data.start, data.stop);
});

function drawLineFromSocket(start, stop) {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(stop.x, stop.y); 
    context.stroke();
    context.beginPath();
}

/* End - Draw Line */

window.addEventListener('load', init, false);
