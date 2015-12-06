
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            unit: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'modules/authentication/test/**/*.js'
                ]
            }
        },

        jsdoc: {
            dist: {
                src: ['modules/**/*.js'],
                options: {
                    destination: 'dist/docs/dev'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('test', ['mochaTest:unit']);
    grunt.registerTask('docs', ['jsdoc:dist']);
};
