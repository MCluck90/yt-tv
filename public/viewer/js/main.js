'use strict';

var youtube = require('youtube-video'),
    socket = io('http://localhost', { query: 'clientType=viewer' }),
    playerElement,
    player;

// Make sure the player is always as big as possible
function resizePlayer(err, playback) {
    if (playback) {
        player = playback;
    }
    playerElement = playerElement || document.getElementById('youtube-video');
    playerElement.width = window.innerWidth;
    playerElement.height = window.innerHeight;
}

window.addEventListener('resize', resizePlayer);

socket.on('new-video', function(videoID) {
    youtube(videoID, {
        autoplay: true,
        controls: false,
        onEnd: function() {
            socket.emit('end');
        }
    }, resizePlayer);
});

socket.on('play', function() {
    if (player) {
        player.playVideo();
    }
});

socket.on('pause', function() {
    if (player) {
        player.pauseVideo();
    }
});