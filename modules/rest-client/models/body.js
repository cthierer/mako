/**
 * Body model
 * @module rest-client/models/Body
 */

var assert = require('assert'),
    _ = require('lodash'),
    ContentType = require('./content_type');

/**
 * @class
 * @param {object} rawContent
 * @param {module:rest-client/models/ContentType} contentType
 */
var Body = function (rawContent, contentType) {
    assert(_.isObject(rawContent), 'rawContent must be an object');
    assert(contentType instanceof ContentType, 'contentType must be a ContentType');

    /**
     * @returns {string}
     */
    this.getHttpContent = function () {
        return contentType.encode(rawContent);
    };

    /**
     * @returns {object}
     */
    this.getRawContent = function () {
        return rawContent;
    };

    /**
     * @returns {module:rest-client/models/ContentType}
     */
    this.getContentType = function () {
        return contentType;
    };
};

module.exports = Body;
