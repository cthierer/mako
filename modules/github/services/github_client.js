/**
 * GitHub Client Service
 * @module github/services/GitHubClient
 */

var _ = require('lodash'),
    assert = require('assert'),
    Promise = require('bluebird'),
    GitHubAPI = require('github'),
    utils = require('../utils'),
    errors = require('../errors');

/**
 * REST GitHub API client. Uses version 3 of the GitHub API.
 * @class
 * @param {object} options API configuration options.
 * @param {boolean} options.debug Enable GitHub API debugging. Defaults to false.
 * @param {string} options.protocol Specify the protocol to use (HTTP or HTTPS).
 *  Defaults to 'https'.
 * @param {string} options.host Specify the URI to the GitHub API. Defaults to
 *  'api.github.com'.
 * @param {string} options.pathPrefix Specify the default path prefix to apply
 *  to API methods. Defaults to `undefined`.
 * @param {integer} options.timeout Specify the timeout of API method calls.
 *  Defaults to 5,000.
 * @param {object} options.headers Specify default headers that should be
 *  included in all API method calls. Defaults to a blank object.
 * @see {@link https://developer.github.com/v3/}
 */
var GitHubClient = function (options) {
    /**
     * GitHub API version to use.
     * @private
     */
    var version = '3.0.0';

    /**
     * GitHub API client instance.
     * @see {@link https://www.npmjs.com/package/github}
     * @private
     */
    var client;

    options = _.clone(_.defaults(options || {}, {
        debug:      false,
        protocol:   'https',
        host:       'api.github.com',
        timeout:    5000,
        headers:    {}
    }));

    options.version = version;

    client = new GitHubAPI(options);

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

    /**
     * @return {string} The GitHub API version being used.
     */
    this.getVersion = function () {
        return version;
    };
};

module.exports = GitHubClient;
