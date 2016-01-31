/**
 * Content Type model
 * @module rest-client/models/ContentType
 */

var assert = require('assert'),
    _ = require('lodash'),
    utils = require('../utils');

/**
 * @constant {string}
 */
const HEADER_KEY = 'content-type';

/**
 * @class
 * @param {string} value
 * @param {object} options 
 * @param {array} options.synonyms
 */
var ContentType = function (value, options) {
    assert(_.isString(value), 'value must be a string');

    /**
     * @private
     * @type {string}
     */
    var value;

    options = _.defaults(options || {}, {
        synonyms: []
    });

    /**
     * @returns {string}
     */
    this.getValue = function () {
        return value;
    };

    /**
     * @returns {array}
     */
    this.getSynonyms = function () {
        return options.synonyms;
    };

    /**
     * @param {module:rest-client/models/message} message
     * @returns {boolean}
     */ 
    this.matches = function (message) {
        return this.matchesValue(message.getHeader(HEADER_KEY));
    };

    /**
     * @param {string} contentType 
     * @returns {boolean} 
     */
    this.matchesValue = function (contentType) {
        if (!_.isString(contentType)) {
            return false;
        }

        return utils.Strings.equalsIgnoreCase(contentType, value) || 
            _.some(options.synonyms, utils.Strings.equalsPredicate(contentType));
    };

    /**
     * @param {module:rest-client/models/Request}
     * @returns {module:rest-client/models/Request}
     */
    this.setContentType = function (request) {
        request.setHeader(HEADER_KEY, this.getValue());
        return request;
    };

    /**
     * @abstract
     * @param {object} content
     * @throws {Error} If not implemented
     * @returns {string}
     */
    this.encode = function (content) {
        throw new Error('not implemented');
    };

    /**
     * @abstract
     * @param {string} content
     * @throws {Error} If not implemented
     * @returns {object}
     */
    this.decode = function (content) {
        throw new Error('not implemented');
    };
};

/**
 * @constant {string}
 */
ContentType.HEADER = HEADER_KEY;

/** 
 * @instance 
 */
ContentType.Factory = new (function () {

    // TODO move factory into a generic class

    /**
     * @private
     * @type {object}
     */
    var instances = {};

    /**
     * @param {string} key 
     * @returns {ContentType}
     */
    this.get = function (key) {
        return instances[key];
    };

    /**
     * @param {string} key 
     * @throws {assert.AssertionError} 
     * @param {ContentType} value 
     */
    this.put = function (key, value) {
        assert(value instanceof ContentType, 'value must be a ContentType');
        instances[key] = value;
    };

    /**
     * @param {string} forValue 
     * @throws {assert.AssertionError} 
     * @returns {ContentType} 
     */
    this.findMatch = function (forValue) {
        var knownTypes = _.values(instances),
            i = 0, 
            match;

        assert(_.isString(forValue), 'forValue must be a string');

        while (!match && i < knownTypes.length) {
            var candidate = knownTypes[i++];

            if (candidate.matchesValue(forValue)) {
                match = candidate;
            }
        }

        return match;
    };
})();

module.exports = ContentType;
