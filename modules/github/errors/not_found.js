/**
 * Not Found Error
 * @module github/errors/NotFound
 */

var util = require('util'),
    _ = require('lodash');

/**
 * Indicates that an expected resource could not be found.
 * @param {string} resource The resource that could not be located.
 * @param {string} error The description of the error that occurred.
 * @class
 * @extends Error
 */
var NotFoundError = function (resource, error) {
    /**
     * Generated error message to show to the user.
     * @private
     */
    var message = 'Unable to find the expected resource';

    // include the resource if provided
    if (_.isString(resource)) {
        message += ' ("' + resource + '")';
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
     * The resource that could not be found.
     * @type {string}
     */
    this.resource = resource;

    /**
     * Details on the specific error that occurred.
     * @type {string}
     */
    this.error = error;
};

util.inherits(NotFoundError, Error);

module.exports = NotFoundError;
