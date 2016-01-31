/**
 * HTTP Error
 * @module rest-client/errors/HTTP
 */

var util = require('util'),
    _ = require('lodash'),
    http = require('http'),
    assert = require('assert');

/**
 * @class
 * @extends {Error}
 * @param {number} code
 * @param {string} details
 */
var HttpError = function (code, details) {
    /**
     * @private
     * @type {string}
     */
    var message = 'HTTP error occurred';

    /**
     * @private
     * @type {string}
     */
    var description = http.STATUS_CODES[code];

    assert(_.isNumber(code), 'code must be a number');

    message += ' (' + code;

    if (_.isString(description)) {
        message += ' - ' + description;
    }

    message += ')';

    if (_.isString(details)) {
        message += ': ' + details;
    }

    Error.call(this, message);

    /**
     * @type {string}
     */
    this.message = message;

    /**
     * @type {number}
     */
    this.code = code;

    /**
     * @type {string}
     */
    this.description = description;

    /**
     * @type {string}
     */
    this.details = details;
};

util.inherits(HttpError, Error);

module.exports = HttpError;
