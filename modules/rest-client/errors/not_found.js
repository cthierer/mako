/**
 * Not found error
 * @module rest-client/errors/NotFound
 */

var util = require('util'),
    RequestError = require('./request');

var NotFoundError = function (details) {
    RequestError.call(this, 404, details);
};

util.inherits(NotFoundError, RequestError);

module.exports = NotFoundError;
