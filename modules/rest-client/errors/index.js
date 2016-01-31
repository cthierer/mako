/**
 * Errors
 * @module rest-client/errors
 */

module.exports = {
    /**
     * Invalid state.
     * @see module:rest-client/errors/InvalidState
     */
    InvalidState: require('./invalid_state'),

    /**
     * Generic HTTP error.
     * @see module:rest-client/errors/HTTP
     */
    HTTP: require('./http'),

    /**
     * HTTP Request error.
     * @see module:rest-client/errors/Request
     */
    Request: require('./request'),

    /**
     * HTTP Not Found error.
     * @see module:rest-client/errors/NotFound
     */
    NotFound: require('./not_found'),

    /**
     * HTTP Server error.
     * @see module:rest-client/errors/Server
     */
    Server: require('./server'),

    /**
     * Unknown Content Type error. 
     * @see module:rest-client/errors/UnknownContentType
     */
    UnkonwnContentType: require('./unknown_content_type')
};
