/**
 * Models 
 * @module rest-client/models
 */

// initialize the factory instances
require('./content_types/json_content_type');

module.exports = {

    /**
     * @see module:rest-client/models/Action
     */
    Action: require('./action'),

    /**
     * @see module:rest-client/models/Body
     */
    Body: require('./body'),

    /**
     * @see module:rest-client/models/ContentType
     */
    ContentType: require('./content_type'),

    /**
     * @see module:rest-client/models/Message
     */
    Message: require('./message'),

    /**
     * @see module:rest-client/models/Request
     */
    Request: require('./request'),

    /**
     * @see module:rest-client/models/Response
     */
    Response: require('./response'),

    /**
     * @see module:rest-client/models/Session
     */
    Session: require('./session')
};