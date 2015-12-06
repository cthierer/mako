/**
 * Authentication Factory Service
 * @module authentication/services/AuthenticationFactory
 */

var _ = require('lodash'),
    assert = require('assert');

/**
 * @class
 */
var AuthenticationFactory = function () {
    /**
     * Mapping of authenticator names to authenticators
     * @private
     */
    var authenticators = {};

    /**
     * Add an Authenticator to the factory.
     * @param {string} name The name to associate the Authenticator with. (Required)
     * @param {object} authenticator The Authenticator to add. An Authenticator
     *  must have an `autenticate` method. (Required)
     * @throws {AssertionError} Thrown if either required parameter is missing
     *  or invalid.
     * @returns {boolean} True if the Authenticator is successfully registered.
     */
    this.add = function (name, authenticator) {
        assert(_.isString(name), 'name must be a string');
        assert(_.isObject(authenticator), 'authenticator must be an object');
        assert(_.isFunction(authenticator.authenticate), 'authenticator must be able to authenticate');

        authenticators[name] = authenticator;
        return true;
    }

    /**
     * Retreive a registered Authenticator, based on name.
     * @param {string} name The name associated with the Authenticator to
     *  retrieve. (Required)
     * @throws {AssertionError} Thrown if the name parameter is missing,
     *  invalid, or does not refer to an existing authenticator.
     * @returns {object} The Authenticator associated with the name parameter.
     */
    this.get = function (name) {
        assert(this.has(name), 'authenticator must exist');
        return authenticators[name];
    };

    /**
     * Check if an Authenticator has been assocaited with the specified name.
     * @param {string} name The name to check.
     * @throws {AssertionError} Thrown if the name parameter is missing or
     *  invalid.
     * @returns {boolean} True if the name is associated with an Authenticator,
     *  false otherwise.
     */
    this.has = function (name) {
        assert(_.isString(name), 'name must be a string');
        return _.has(authenticators, name);
    };
};

module.exports = new AuthenticationFactory();
