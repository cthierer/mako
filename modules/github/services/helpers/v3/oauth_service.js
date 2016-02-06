/**
 * OAuth Service Helper 
 * @module github/services/helpers/v3/OAuthService
 */

var assert = require('assert'),
    util = require('util'),
    path = require('path').posix,
    _ = require('lodash'),
    logger = require('log4js').getLogger(),
    restClient = require('../../../../rest-client'),
    errors = require('../../../errors'),
    RESTClientService = restClient.services.RESTClientService,
    Body = restClient.models.Body,
    ContentType = restClient.models.ContentType, 
    Action = restClient.models.Action;

/** 
 * @constant
 * @type {string}
 */
const PATH_PREFIX = '/login/oauth';

/**
 * @constant
 * @type {string}
 */
const PATH_ACCESS_TOKEN = '/access_token';

/**
 * @class 
 * @param {object} options
 * @param {object} options.github Parameters to define the connection to GitHub.
 *  See {@link module:rest-client/services/RESTClientService} for options.
 */ 
var OAuthServiceHelper = function (options) {
    options = _.defaults(options || {}, {
        github: {}
    });

    if (_.isString(options.github.pathPrefix)) {
        // TODO turn this into an utility fn
        options.github.pathPrefix = path.join(options.github.pathPrefix, 
            PATH_PREFIX);
    } else {
        options.github.pathPrefix = PATH_PREFIX;
    }

    RESTClientService.call(this, options.github);

    /**
     * @param {string} clientId
     * @param {string} clientSecret 
     * @param {string} code 
     * @param {object} options 
     * @param {object} options.redirectURI 
     * @param {object} options.state 
     * @returns {bluebird.Promise} 
     */
    this.createAccessToken = function (clientId, clientSecret, code, options) {
        var headers = {},
            parameters = {};

        // verify the required parameters
        assert(_.isString(clientId) && !_.isEmpty(clientId), 'clientId must be a non-empty string');
        assert(_.isString(clientSecret) && !_.isEmpty(clientSecret), 'clientSecret must be a non-empty string');
        assert(_.isString(code) && !_.isEmpty(code), 'code must be a non-empty string');

        // initialize options if not already set
        options = _.defaults(options || {}, {
            redirectURI: null,
            state: null
        });

        if (logger.isDebugEnabled()) {
            logger.debug('Requesting access token; code =', code);
        }

        // map the input parameters to the GitHub parameters 
        // TODO is this the correct format? should this be in teh body?
        parameters['client_id'] = clientId;
        parameters['client_secret'] = clientSecret;
        parameters['code'] = code;

        if (options.redirectURI) {
            parameters['redirect_uri'] = options.redirectURI;
        }

        if (options.state) {
            parameters['state'] = options.state;
        }

        // specify that the result should be JSON
        headers['Accept'] = ContentType.Factory.get('application/json').getValue();

        // make the POST request, and then decode the response 
        // TODO encapsulate makeRequest into various actions (i.e., post, get)
        return this.makeRequest(Action.Factory.get('post'), PATH_ACCESS_TOKEN, {
            body: new Body(parameters, ContentType.Factory.get('application/json')),
            headers: headers
        }).then(function (response) {
            // TODO need to standardize this in a model? document?
            var jsonResponse = response.getBody().getRawContent();
            
            if (_.has(jsonResponse, 'error')) {
                var err = new errors.GitHub(jsonResponse);

                logger.error('Encountered GitHub error -', err.message, '(' + 
                    err.errorCode, '-', err.errorURI + ')');

                throw err;
            }

            return {
                tokenType: jsonResponse['token_type'],
                scope: jsonResponse['scope'],
                accessToken: jsonResponse['access_token']
            };
        }).catch(function (err) {
            logger.error('Encountered error while getting token -', err.toString());
            throw err;
        });
    };
};

util.inherits(OAuthServiceHelper, RESTClientService);

module.exports = OAuthServiceHelper;
    