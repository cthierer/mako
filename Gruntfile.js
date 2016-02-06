
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
                    'modules/authentication_github/test/**/*.mocha.js',
                    'modules/github/test/**/*.mocha.js',
                    'modules/rest-client/test/**/*.mocha.js',
                    'modules/router-extendable/test/**/*.mocha.js'
                ]
            }
        },

        jsdoc: {
            dist: {
                src: ['modules/**/*.js', 'server/**/*.js'],
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
            },
            server: {
                src: ['server/**/*.js'],
                options: {
                    configFile: 'server/eslint.config.json'
                }
            }
        },

        copy: {
            app: {
                src: ['app/**/*.html'],
                dest: 'dist/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('test', ['mochaTest:unit']);
    grunt.registerTask('docs', ['jsdoc:dist']);
    grunt.registerTask('lint', ['eslint:modules', 'eslint:server']);
    grunt.registerTask('build', ['lint','test','copy:app','docs']);
};
