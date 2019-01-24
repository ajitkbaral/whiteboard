const express = require('express');
const app = express();

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

app.use('/static', express.static('static'));

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log('Server running at port 3000')


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/whiteboard.html');
});

app.get('/whiteboard', function(req, res) {
    res.sendFile(__dirname + '/whiteboard.html');
});

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Total socket connected: %s ', connections.length);


    //Disconnected
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);
        console.log('Socket disconnected.\nTotal Connection: %s', connections.length)
    });


    //New User
    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    })

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

    //Send Message
    socket.on('send message', function(data) {
        console.log('New Message Available: %s', data);
        io.sockets.emit('new message', {message: data, user: socket.username});
    });


    socket.on('draw', function(data) {
        io.sockets.emit('new draw', {points: data.points, socketColor: data.socketColor, socketRadius: data.socketRadius});
    });
});



