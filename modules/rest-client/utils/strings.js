/**
 * Strings Utils
 * @module rest-client/utils/Strings 
 */ 

var _ = require('lodash'),
    assert = require('assert');

/**
 * @param {string} str1 
 * @param {string} str2 
 * @returns {boolean}
 */
function equalsIgnoreCase (str1, str2) {
    return _.isString(str1) && _.isString(str2) && 
        str1.toLowerCase() === str2.toLowerCase();
};

module.exports = {

    /**
     * Returns a function, which can be used to test if another string value 
     * is equal to the value parameter. 
     * @param {string} value 
     * @throws {assert.AssertionError} If value is not a valid string.
     * @returns {function}
     */
    equalsPredicate: function (value) {
        assert(_.isString(value), 'value must be a string');
        return function (string) { return equalsIgnoreCase(string, value); }
    },

    /**
     * @see {module:rest-client/utils/String#equalsIgnoreCase}
     */
    equalsIgnoreCase: equalsIgnoreCase
};