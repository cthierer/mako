/**
 * Request error
 * @module rest-client/errors/Request
 */

var util = require('util'),
    HttpError = require('./http');

/**
 * @class
 * @extends {module:rest-client/errors/HTTP}
 * @param {number} code
 * @param {string} details
 */
var RequestError = function (code, details) {
    HttpError.call(this, code, details);
};

util.inherits(RequestError, HttpError);

module.exports = RequestError;
