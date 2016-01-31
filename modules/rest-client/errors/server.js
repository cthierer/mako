/**
 * Server error
 * @module rest-client/errors/Server
 */

var util = require('util'),
    HttpError = require('./http');

/**
 * @class
 * @extends {module:rest-client/errors/HTTP}
 * @param {number} code
 * @param {string} details
 */
var ServerError = function (code, details) {
    HttpError.call(this, code, details);
};

util.inherits(ServerError, HttpError);

module.exports = ServerError;
