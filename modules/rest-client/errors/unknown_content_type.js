/**
 * Unkown Content Type error 
 * @module rest-client/errors/ContentType
 */

var util = require('util'),
    _ = require('lodash');

/** 
 * @class
 * @extends {Error}
 * @param {string} contentType 
 */
var UnknownContentTypeError = function (contentType) {

    /**
     * @private 
     * @type {string} 
     */
    var message = 'Unknown content type specified';

    if (_.isString(contentType)) {
        message += ': "' + contentType + '"';
    }

    Error.call(this, message);

    /**
     * @type {string}
     */
    this.message = message;

    /**
     * @type {string} 
     */
    this.contentType = contentType;
};

util.inherits(UnknownContentTypeError, Error);

module.exports = UnknownContentTypeError;