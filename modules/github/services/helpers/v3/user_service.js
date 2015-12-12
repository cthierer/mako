/**
 * GitHub User Service Helper (v3)
 * @module github/services/helpers/v3/UserServiceHelper
 */

var assert = require('assert'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    errors = require('../../../errors'),
    utils = require('../../../utils');

/**
 * GitHub methods around the User entity. Supports v3 of the GitHub API.
 * @class
 * @param {object} client The initialized GitHub API instance.
 */
var UserServiceHelper = function (client) {
    assert(!_.isUndefined('client'), 'client must be defined');
    assert(!_.isNull('client'), 'client must not be null');

    /**
     * Return a user identified by username and password.
     * @param {string} username The user's name.
     * @param {string} password The user's password.
     * @throws {AssertionError} Thrown if either parameter is missing or not a
     *  string.
     * @throws {AuthenticationError} Thrown if there was an authentication
     *  failure with the given username and password. If the user is not valid
     *  or not found, then this will trigger an authentication error.
     * @throws {ServiceError} Thrown if an error occurrs communciating with the
     *  API.
     * @returns {object} An instantiated User object
     */
    this.getUserByPassword = function (username, password) {
        var deferred = Promise.pending();

        // TODO are assertion errors the right type of error for promises?
        assert(_.isString(username), 'username is required');
        assert(!_.isEmpty(username), 'username must not be blank');
        assert(_.isString(password), 'password is required');
        assert(!_.isEmpty(password), 'password must not be blank');

        client.authenticate({
            type: 'basic',
            username: username,
            password: password
        });

        client.user.get({}, function (err, result) {
            if (err) {
                if (err.code == 401) {
                    // not authorized
                    deferred.reject(new errors.Authentication(username,
                        utils.errors.getErrorMessage(err)));
                } else {
                    deferred.reject(new errors.Service(err));
                }
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    };
};

module.exports = UserServiceHelper;
