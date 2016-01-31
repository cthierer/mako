/**
 * JSON Content Type
 * @module rest-client/models/content_types/JSONContentType
 */

/**
 * @contstant {string}
 */
const DEFAULT_CONTENT_TYPE = 'application/json';

/**
 * @constant {array}
 */
const TYPE_SYNONYMS = ['text/json'];

var util = require('util'),
    _ = require('lodash'),
    ContentType = require('../content_type');

/**
 * @class 
 * @extends {module:rest-client/modles/ContentType}
 */
var JSONContentType = function () {
    ContentType.call(this, DEFAULT_CONTENT_TYPE, {
        synonyms: TYPE_SYNONYMS
    });


    /** 
     * @param {object} content 
     * @returns {string}
     */
    this.encode = function (content) {
        return _.isObject(content) || _.isArray(content) 
            ? JSON.stringify(content) 
            : '';
    };

    /**
     * @param {string} content 
     * @returns {object}
     */
    this.decode = function (content) {
        return _.isString(content) && !_.isEmpty(content) 
            ? JSON.parse(content) 
            : {};
    };
};

util.inherits(JSONContentType, ContentType);

// TODO better way to store this? 
ContentType.Factory.put(DEFAULT_CONTENT_TYPE, new JSONContentType());

module.exports = JSONContentType;