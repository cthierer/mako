/**
 * GitHub Client Service
 * @module github/services/GitHubClient
 */

var _ = require('lodash'),
    assert = require('assert'),
    Promise = require('bluebird'),
    GitHubAPI = require('github'),
    utils = require('../utils'),
    errors = require('../errors'),
    helpers = require('./helpers');

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
     * Client services available. Used to help organize methods.
     * @private
     */
    var services = {};

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

    services.user = new helpers.v3.UserService(client);
    services.oauth = new helpers.v3.OAuthService({github: _.clone(options)});

    /**
     * Avaialable services on this client.
     * @type {object}
     */
    this.services = services;

    /**
     * @return {string} The GitHub API version being used.
     */
    this.getVersion = function () {
        return version;
    };
};

module.exports = GitHubClient;
