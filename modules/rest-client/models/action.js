/**
 * Action model (abstract)
 * @module rest-client/models/Action
 */

var assert = require('assert'),
    _ = require('lodash'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    querystring = require('querystring'),
    logger = require('log4js').getLogger(),
    Request = require('./request');

/**
 * Encapsulates an HTTP action (GET, POST, etc.) on a REST client.
 * @class
 * @param {string} method The HTTP method to use for this action.
 */
var Action = function (method) {
    assert(_.isString(method), 'method must be a string');
    assert(_.contains(http.METHODS, method), 'method must be a valid HTTP method');

    /**
     * Build a path string using the provided path and query parameters.
     * @private
     * @param {string} pathname The existing known path, not including a querystring.
     * @param {object} params The parameters that should be passed in the querystring.
     * @throws {assert.AssertionError} If pathname is not a valid string.
     * @returns {string} The path including the querystring.
     */
    function buildPath (pathname, params) {
        var path = pathname;

        assert(_.isString(pathname), 'pathname must be a string');

        if (_.isObject(params) && params) {
            var formatted = querystring.stringify(params);
            path += '?' + formatted;
        }

        return path;
    };

    /**
     * Get the appropriate Node HTTP module ("engine") based on the protocol.
     * @private
     * @param {string} protocol The HTTP protocol being used.
     * @returns {object} The appropriate HTTP engine to make a request.
     * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/http.html|Node HTTP module}
     * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/https.html|Node HTTPS module}
     */
    function getEngine (protocol) {
        return protocol === 'https' ? https : http;
    };

    /**
     * Build the HTTP request options object, including path, header, and method.
     * The path includes the querystring arguments, if provided.
     * @private
     * @param {object} options Additional options to include.
     * @param {string} options.hostname Identifier for the remote server.
     * @param {number} options.port Remote server port to connect to.
     * @param {string} options.pathname The path to issue the request to.
     * @param {object} options.parameters The querystring parameters to include.
     * @param {object} options.headers The HTTP header values to send with the request.
     * @throws {assert.AssertionError} If hostname or pathname parameters are not
     *  valid strings.
     * @returns {object} Initialized HTTP options that can be be used to start
     *  an HTTP request.
     * @see {@link https://nodejs.org/dist/latest-v4.x/docs/api/http.html#http_http_request_options_callback|HTTP options object}
     */
    function getHttpOptions (options) {
        var httpOptions = _.defaults(options || {}, {
            port: 80,
            parameters: {},
            headers: {},
            protocol: 'http'
        });

        if (!options) {
            options = {};
        }

        assert(_.isString(options.hostname), 'hostname must be a string');
        assert(_.isString(options.pathname), 'pathname must be a string');

        httpOptions.path = buildPath(httpOptions.pathname, options.parameters);
        httpOptions.header = options.headers;
        httpOptions.method = method;
        httpOptions.protocol += ':';

        return httpOptions;
    };

    /**
     * @returns {string}
     */
    this.getMethod = function () {
        return method;
    };

    /**
     * Start a new REST request against the specified endpoint. This does not
     * send the response, but intializes it; the request is not sent until the
     * body is populated.
     * @param {object} options Additional options.
     * @param {string} options.hostname Identifier for the remote server.
     * @param {number} options.port Remote server port to connect to.
     * @param {string} options.pathname The path to issue the request to.
     * @param {object} options.parameters The querystring parameters to include.
     * @param {object} options.headers The HTTP header values to send with the request.
     * @returns {module:rest-client/models/Request} The intialized request, which
     *  can be further modified, before being sent to the remote server.
     */
    this.initializeRequest = function (options) {
        var httpOptions = getHttpOptions(_.clone(options || {})),
            engine = getEngine(options.protocol);

        // TODO add lifecycle hooks to customize initialization behavior

        return new Request(engine.request(httpOptions));
    };
};

Action.Factory = new (function () {

    // TODO move factory to a generic class 

    /** 
     * @private 
     * @type {object}
     */
    var instances = {
        'delete':   new Action('DELETE'),
        'get':      new Action('GET'),
        'head':     new Action('HEAD'),
        'patch':    new Action('PATCH'),
        'post':     new Action('POST'),
        'put':      new Action('PUT'),
        'options':  new Action('OPTIONS')
    };

    /** 
     * @param {string} key 
     * @returns {Action} 
     */
    this.get = function (key) {
        if (!_.isString(key)) {
            return;
        }

        key = key.toLowerCase();

        return instances[key];
    };

    // instantiate short-cuts for methods 
    for (var key in instances) {
        Action[key.toUpperCase()] = instances[key];
    }
})();

module.exports = Action;
