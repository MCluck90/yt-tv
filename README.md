# YT-TV

*Inspired by [PiR.tv][1]*

Provides a simple way to stream YouTube video to your Raspberry Pi.

## Prerequisites

* [OMXPlayer][2]: Should come pre-installed on your Raspberry Pi

## Installation

```bash
$ npm install
```

Go through each of the files under `/public` and replace `localhost` with your Pi's IP address

## Usage

### Server Side

Fire it up with `$ node server/main.js`


### Client Side

Pick your favorite browser and go to `http://YOUR-PI-ADDRESS:8080/remote` and start searching for YouTube videos! Click/Tap the video thumbnail to start loading the stream. 

Best used on mobile devices for the full remote experience.

### License

[WTFPL][3]

### Contributions

Feel free to message me or submit a pull request if you feel so inclined. As long as your code makes sense and isn't ugly then I'll probably merge it in.


  [1]: https://github.com/DonaldDerek/PiR.tv
  [2]: https://github.com/popcornmix/omxplayer
  [3]: http://www.wtfpl.net/
