
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
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['mochaTest:unit']);
};
