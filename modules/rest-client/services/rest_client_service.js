/**
 * REST Client Service
 * @module rest-client/services/RESTClientService
 */

var assert = require('assert'),
    path = require('path').posix,
    logger = require('log4js').getLogger(),
    _ = require('lodash'),
    models = require('../models');

/**
 * @class
 * @param {object} options
 * @param {string} options.protocol
 * @param {string} options.host
 * @param {number} options.port
 * @param {string} options.pathPrefix
 */
var RESTClientService = function (options) {

    assert(_.isObject(options), 'options must be defined');
    assert(_.has(options, 'host'), 'host must be provided');

    var clientOptions = _.defaults(options, {
        protocol: 'http',
        port: options.protocol === 'https' ? 443 : 80, 
        pathPrefix: '/'
    });

    /**
     * @private 
     * @type {module:rest-client/models/Session}
     */
    var session;

    /**
     * @returns {string}
     */
    this.getProtocol = function () {
        return clientOptions.protocol;
    };

    /**
     * @returns {number}
     */
    this.getPort = function () {
        return clientOptions.port;
    };

    /**
     * @returns {string}
     */
    this.getPathPrefix = function () {
        return clientOptions.pathPrefix;
    };

    /**
     * @returns {string}
     */
    this.getHost = function () {
        return clientOptions.host;
    };

    /**
     * @param {module:rest-client/models/Action} action
     * @param {string} endpoint
     * @param {object} options
     * @param {object} options.headers
     * @param {object} options.parameters
     * @param {object} options.body
     * @returns {bluebird.Promise}
     */
    this.makeRequest = function (action, endpoint, options) {
        var requestOptions = {},
            session = this.hasSession() ? this.getSession() : false,
            request;

        // TODO encapsulate parameters in a model object? (Endpoint?) 

        assert(action instanceof models.Action, 'action must be an Action');
        assert(_.isString(endpoint), 'endpoint must be a string');

        options = _.defaults(options || {}, {
            headers: {},
            parameters: {},
        });

        // set the request options 
        requestOptions.hostname = clientOptions.host;
        requestOptions.protocol = clientOptions.protocol;
        requestOptions.port = clientOptions.port;
        requestOptions.pathname = path.join(clientOptions.pathPrefix, endpoint);
        requestOptions.parameters = options.parameters;
        requestOptions.headers = options.headers;

        if(logger.isDebugEnabled()) {
            logger.debug('Initializing REST request -', requestOptions);
        }

        // generate the request 
        request = action.initializeRequest(requestOptions);

        // authorize using the session, if applicable
        if (session) {
            request = session.authenticate(request);
        }

        // make the request, passing a body if provided 
        return request.send(options.body).then(function (response) {
            // refresh the session, if applicable 
            if (session) {
                response = session.refresh(response);
            }

            // return the response
            return response;
        });
    };

    /**
     * @returns {boolean}
     */
    this.hasSession = function () {
        return !_.isUndefined(session) && !_.isNull(session); 
    };

    /**
     * @param {module:rest-client/models/Session} newSession
     */
    this.setSession = function (newSession) {
        assert(newSession instanceof models.Session, 'newSession must be a Session');
        session = newSession;
    };

    /**
     * @returns {module:rest-client/models/Session} 
     */
    this.getSession = function () {
        return session;
    };

    /**
     * @returns {module:rest-client/models/Session} 
     */
    this.clearSession = function () {
        var oldSession = session;
        session = null;
        return oldSession;
    };
};

module.exports = RESTClientService;
