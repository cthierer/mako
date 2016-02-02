
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            unit: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'modules/authentication/test/**/*.mocha.js',
                    'modules/github/test/**/*.mocha.js',
                    'modules/rest-client/test/**/*.mocha.js',
                    'modules/router-extendable/test/**/*.mocha.js'
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
        }, 

        eslint: {
            modules: {
                src: ['modules/**/*.js'],
                options: {
                    configFile: 'modules/eslint.config.json'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('test', ['mochaTest:unit']);
    grunt.registerTask('docs', ['jsdoc:dist']);
    grunt.registerTask('lint', ['eslint:modules']);
    grunt.registerTask('build', ['lint','test','docs']);
};
