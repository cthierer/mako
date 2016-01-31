/**
 * Session model
 * @module rest-client/models/Session
 */

/**
 * @class
 */
var Session = function () {

    /**
     * @abstract
     * @param {module:rest-client/models/Request} request
     * @throws {Error} If not implemented
     * @returns {module:rest-client/models/Request}
     */
    this.authenticate = function (request) {
        throw new Error('not implemented');
    };

    /**
     * @abstract 
     * @param {module:rest-client/models/Resposne} response 
     * @throws {Error} If not implemented 
     * @returns {module:rest-client/modles/Response}
     */
    this.refresh = function (response) {
        throw new Error('not implemented');
    };
};

module.exports = Session;
