'use strict';

var express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io').listen(server),

    viewers = [],
    publicDir = path.join(__dirname, '../public');

app.set('port', 80);
app.use(express.static(publicDir));

app.get('/', function(req, res) {
    res.sendfile(publicDir + '/viewer/index.html');
});

app.get('/remote', function(req, res) {
    res.sendfile(publicDir + '/remote/index.html');
});

server.listen(app.get('port'), function() {
    console.log('YT-TV is running on port ' + app.get('port'));
});

function broadcastToViewers(event, data) {
    for (var i = 0, len = viewers.length; i < len; i++) {
        viewers[i].emit(event, data);
    }
}

io.sockets.on('connection', function(socket) {
    var clientType = socket.handshake.query.clientType;
    if (clientType === 'viewer') {
        viewers.push(socket);
        socket.on('disconnect', function() {
            var index = viewers.indexOf(socket);
            viewers.splice(1, index);
        });
        return;
    }

    socket.on('new-video', function(videoID) {
        broadcastToViewers('new-video', videoID);
    });
    socket.on('play', function() {
        broadcastToViewers('play');
    });
    socket.on('pause', function() {
        broadcastToViewers('pause');
    });
});