/**
 * Service Error
 * @module github/errors/Service
 */

var util = require('util'),
    utils = require('../utils'),
    _ = require('lodash');

/**
 * Represents a generic error with the API client.
 * @param {object} error The Error that occurred.
 * @class
 * @extends Error
 */
var ServiceError = function (error) {
    /**
     * Generated error messsage to display.
     * @private
     */
    var message = utils.errors.getErrorMessage(error);

    Error.call(this, message);

    /**
     * The message to display for this error.
     * @type {string}
     */
    this.message = message;
};

util.inherits(ServiceError, Error);

module.exports = ServiceError;
