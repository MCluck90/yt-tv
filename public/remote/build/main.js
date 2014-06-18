(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var socket = io('http://localhost', { query: 'clientType=remote' }),
    resultsTable = document.getElementById('results'),

    $search = $('#search');

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
    $.ajax({
        url: 'http://gdata.youtube.com/feeds/api/videos',
        type: 'GET',
        data: {
            vq: query,
            'max-results': 12,
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
    socket.emit('new-video', this.videoID);
});

},{}]},{},[1])