'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        browserify: {
            debug: {
                files: {
                    'public/viewer/build/main-debug.js': ['public/viewer/js/main.js'],
                    'public/remote/build/main-debug.js': ['public/remote/js/main.js']
                },
                options: {
                    bundleOptions: { debug: true }
                }
            },
            release: {
                files: {
                    'public/viewer/build/main.js': ['public/viewer/js/main.js'],
                    'public/remote/build/main.js': ['public/remote/js/main.js']
                }
            }
        }
    });

    grunt.registerTask('default', 'browserify');
};