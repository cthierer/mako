/**
 * HTTP message 
 * @module rest-client/models/Message 
 */

/**
 * @class
 */
var Message = function () {

    /** 
     * @abstract
     * @param {string} key
     * @throws {Error} If the method is not overridden by a sub-class 
     * @returns {string} 
     */
    this.getHeader = function (key) {
        throw new Error('not implemented');
    };
};

module.exports = Message;