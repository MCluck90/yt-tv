'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        browserify: {
            debug: {
                files: {
                    'public/remote/build/main-debug.js': ['public/remote/js/main.js']
                },
                options: {
                    bundleOptions: { debug: true }
                }
            },
            release: {
                files: {
                    'public/remote/build/main.js': ['public/remote/js/main.js']
                }
            }
        }
    });

    grunt.registerTask('default', 'browserify');
};