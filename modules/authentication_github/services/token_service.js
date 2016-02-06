/**
 * Token Service
 * @module authentication_github/services/TokenService
 */

var assert = require('assert'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    GitHub = require('../../github/');

/**
 * @class
 * @param {module:github/services/GitHubClient} githubClient 
 * @param {object} options 
 * @param {object} options.github (required)
 * @param {object} options.github.oauth (required)
 * @param {object} options.github.oauth.client_id (required)
 * @param {object} options.github.oauth.client_secret (required) 
 * @param {object} options.github.oauth.redirect_uri (required)
 */
var TokenService = function (githubClient, options) {
    options = _.defaults(options || {}, {
        github: {
            oauth: {
                client_id: null,
                client_secret: null,
                redirect_uri: null
            }
        }
    });

    assert(githubClient instanceof GitHub.services.GitHubClient, 
        'github client must be an instance of GitHubClient class');
    assert(!_.isNull(getClientID()) && !_.isUndefined(getClientID()),
        'github client ID must be defined');
    assert(!_.isNull(getClientSecret()) && !_.isUndefined(getClientSecret()),
        'github client secret must be defined');
    assert(!_.isNull(getRedirectURI()) && !_.isUndefined(getRedirectURI()),
        'github redirect URI must be defined');

    /**
     * @private
     * @return {string}
     */
    function getClientID () {
        return options.github.oauth['client_id'];
    };

    /**
     * @private
     * @return {string}
     */
    function getClientSecret () {
        return options.github.oauth['client_secret'];
    };

    /**
     * @private 
     * @return {string}
     */
    function getRedirectURI () {
        return options.github.oauth['redirect_uri'];
    };

    /**
     * @param {string} code
     * @param {string} state
     * @return {bluebird.Promise}
     */
    this.createToken = function (code, state) {
        var clientId = getClientID(),
            clientSecret = getClientSecret(),
            redirectURI = getRedirectURI();

        assert(_.isString(code) && !_.isEmpty(code), 
            'code must be a non-empty string');

        return githubClient.services.oauth.createAccessToken(clientId, clientSecret, code, {
            redirectURI: redirectURI,
            state: state
        }).then(function (githubToken) {
            return githubToken;
        });
    };

};

module.exports = TokenService;