/**
 * Invalid State Error
 * @module rest-client/errors/InvlidState
 */

var util = require('util');

/**
 * @class
 * @extends {Error}
 * @param {string} message
 */
var InvalidStateError = function (message) {
    Error.call(this, message);
    this.message = message;
};

util.inherits(InvalidStateError, Error);

module.exports = InvalidStateError;
