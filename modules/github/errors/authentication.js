/**
 * Authentication Error
 * @module github/errors/Authentication
 */

var util = require('util'),
    _ = require('lodash');

/**
 * Represents a failed authentication attempt.
 * @param {string} username The username of the user that failed authentication.
 * @param {string} error The description of the error that occurred.
 * @class
 * @extends Error
 */
var AuthenticationError = function (username, error) {
    /**
     * Generated error message to show to the user.
     * @private
     */
    var message = 'Error authenticating user';

    // include the user name if provided
    if (_.isString(username)) {
        message += ' "' + username + '"';
    }

    // include the error message if provided
    if (_.isString(error)) {
        message += ': ' + error;
    }

    Error.call(this, message);

    /**
     * The message to display for this error.
     * @type {string}
     */
    this.message = message;

    /**
     * The name of the user that failed authentication.
     * @type {string}
     */
    this.username = username;

    /**
     * Details on the specific authentication error that occurred.
     * @type {string}
     */
    this.error = error;
};

util.inherits(AuthenticationError, Error);

module.exports = AuthenticationError;
