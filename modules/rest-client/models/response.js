/**
 * Response model
 * @module rest-client/models/Response
 */

var util = require('util'),
    assert = require('assert'),
    http = require('http'),
    _ = require('lodash'),
    Message = require('./message'),
    errors = require('../errors');

/**
 * @class
 * @extends {module:rest-client/models/Message}
 * @param {number} code
 * @param {object} options
 * @param {object} options.headers
 * @param {string} options.body
 * @param {module:rest-client/models/ContentType} options.contentType
 */
var Response = function (code, options) {
    assert(_.has(http.STATUS_CODES, code), 'code must be a valid status code');

    Message.call(this);

    /**
     * @returns {boolean}
     */
    this.isError = function () {
        return code >= 400;
    };

    /**
     * @returns {module:rest-client/errors/HTTP}
     */
    this.getError = function () {
        if (!this.isError()) {
            return;
        }

        // TODO implement more flexible mechanism to identify errors
        if (code == 404) {
            return new errors.NotFound();
        } else if (code < 500) {
            return new errors.Request(code);
        } else {
            return new errors.Server(code);
        }
    };

    /**
     * @param {string} key 
     * @returns {string}
     */
    this.getHeader = function (key) {
        var headers = this.getHeaders();
        return headers[key];
    };

    /**
     * @returns {module:rest-client/models/Body} 
     */
    this.getBody = function () {
        return options.body;
    };

    /**
     * @returns {object}
     */
    this.getHeaders = function () {
        return options.headers;
    };

    /** 
     * @returns {number}
     */
    this.getCode = function () {
        return code;
    };
};

util.inherits(Response, Message);

module.exports = Response;
