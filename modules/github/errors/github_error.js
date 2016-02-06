/**
 * GitHub Error
 * @module github/errors/GitHubError
 */

var util = require('util'),
    _ = require('lodash');

/**
 * @class
 * @extends Error
 */
var GitHubError = function (errorObj) {

    /**
     * @private
     */
    var message;

    errorObj = _.defaults(errorObj || {}, {
        error_description: 'Unknown GitHub error'
    });

    message = errorObj['error_description'];

    Error.call(this, message);

    /**
     * @type {string}
     */
    this.message = message;

    /**
     * @type {string}
     */
    this.errorCode = errorObj['error'];

    /**
     * @type {string}
     */
    this.errorURI = errorObj['error_uri'];
};

util.inherits(GitHubError, Error);

module.exports = GitHubError;