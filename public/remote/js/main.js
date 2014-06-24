'use strict';

var socket = io('http://localhost:8080', { query: 'clientType=remote' }),
    resultsTable = document.getElementById('results'),

    $search = $('#search'),

    linksEnabled = true;

function fillResults(entries) {
    for (var i = 0, len = entries.length; i < len; i++) {
        var row = document.createElement('tr'),
            cell = document.createElement('td'),
            entry = entries[i],
            id = entry.id.$t.split('/')[6],
            title = entry.title.$t,
            thumbnailData = entry.media$group.media$thumbnail[0],
            thumbnail = thumbnailData.url,
            duration = thumbnailData.time,

            thumbnailEl = document.createElement('img'),
            titleEl = document.createElement('a'),
            durationEl = document.createElement('span');

        thumbnailEl.className = 'thumbnail';
        thumbnailEl.src = thumbnail;
        thumbnailEl.videoID = id;
        titleEl.innerHTML = title;
        titleEl.className = 'video-title';
        titleEl.href = 'javascript:void(0)';
        titleEl.videoID = id;
        durationEl.innerHTML = '(' + duration + ')';

        cell.appendChild(thumbnailEl);
        cell.appendChild(titleEl);
        cell.appendChild(durationEl);

        row.appendChild(cell);
        resultsTable.appendChild(row);
    }
}

function search() {
    var query = $search.val();
    if (query.length === 0) {
        return;
    }

    query = query.replace(/http[s]:\/\//, '');
    query = query.replace('www.youtube.com/watch?v=', '');

    $.ajax({
        url: 'http://gdata.youtube.com/feeds/api/videos',
        type: 'GET',
        data: {
            vq: query,
            'max-results': 15,
            alt: 'json'
        },
        success: function(data) {
            resultsTable.innerHTML = '';
            fillResults(data.feed.entry);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

$search.blur(search);
$search.keyup(function(evt) {
    // Pressed enter
    if (evt.keyCode === 13) {
        search();
    }
});

// Select a video
$('body').delegate('.thumbnail, .video-title', 'click', function() {
    if (linksEnabled) {
        socket.emit('new-video', this.videoID);
    }
});

$('#play-pause').click(function() {
    socket.emit('play-pause');
    $('.thumbnail').addClass('disabled-link');
});

// Disable/Enable videos depending on if another is loading
socket.on('playing', function() {
    $('.thumbnail').removeClass('disabled-link');
    linksEnabled = true;
});

socket.on('loading', function() {
    $('.thumbnail').addClass('disabled-link');
    linksEnabled = false;
});