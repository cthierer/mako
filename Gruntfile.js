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
                        'bootstrap': 'components/bootstrap/dist/js/bootstrap.min',
                        'eventEmitter': 'components/eventemitter2/lib/eventemitter2',
                        'jquery': 'components/jquery/dist/jquery',
                        'lodash': 'components/lodash/lodash',
                        'js-yaml': 'components/js-yaml/dist/js-yaml.min',
                        'marked': 'components/marked/lib/marked',
                        'qwest': 'components/qwest/qwest.min',
                        'ui': 'components/jqueryui/jquery-ui.min'
                    },
                    out: 'app/client/mako.min.js'
                }
            }
        }

    });

    grunt.registerTask('build', ['requirejs']);

    grunt.registerTask('heroku:production', ['build']);

};
