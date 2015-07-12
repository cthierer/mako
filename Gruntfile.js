'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'app/client/scripts',
                    name: 'mako-client',
                    paths: {
                        'bluebird': 'components/bluebird/js/browser/bluebird',
                        'jquery': 'components/jquery/dist/jquery',
                        'lodash': 'components/lodash/lodash',
                        'qwest': 'components/qwest/qwest.min'
                    },
                    out: 'app/client/mako.min.js'
                }
            }
        }

    });

    grunt.registerTask('build', ['requirejs']);

};
