'use strict';

var express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io').listen(server),
    omx = require('omxcontrol'),
    youtubedl = require('youtube-dl'),

    sockets = [],
    publicDir = path.join(__dirname, '../public'),
    loadingVideo = false,

    VIDEO_NOT_FOUND_ID = 'DH3ItsuvtQg';

app.set('port', 8080);
app.use(express.static(publicDir));
app.use(omx());

app.get('/', function(req, res) {
    res.sendfile(publicDir + '/viewer/index.html');
});

app.get('/remote', function(req, res) {
    res.sendfile(publicDir + '/remote/index.html');
});

server.listen(app.get('port'), function() {
    console.log('YT-TV is running on port ' + app.get('port'));
});

function broadcastToSockets(event, data) {
    sockets.forEach(function(socket) {
        socket.emit(event, data);
    });
}

function runVideo(videoID) {
    if (loadingVideo) {
        return;
    }
    console.log('Loading video...');
    loadingVideo = true;
    broadcastToSockets('loading');
    youtubedl.getInfo('https://youtube.com/watch?v=' + videoID, ['--max-quality=22'], function(err, info) {
        if (err) {
            console.log('Error: ' + err.toString());
            if (videoID === VIDEO_NOT_FOUND_ID) {
                throw err;
            } else {
                runVideo(VIDEO_NOT_FOUND_ID);
            }
            return;
        }

        console.log('Playing ' + info.title);
        loadingVideo = false;
        broadcastToSockets('playing');
        omx.quit();
        omx.start(info.url);
    });
}

io.sockets.on('connection', function(socket) {
    sockets.push(socket);
    console.log('Connected socket');
    if (loadingVideo) {
        socket.emit('loading');
    }
    socket.on('new-video', runVideo);

    socket.on('play-pause', function() {
        console.log('Pause toggled');
        omx.pause();
    });

    socket.on('disconnect', function() {
        sockets.splice(1, sockets.indexOf(socket));
    });
});