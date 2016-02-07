/**
 * @module authentication/services
 */
module.exports = {

    /**
     * @see module:authentication/services/ProviderFactory
     */
    ProviderFactory: require('./provider_factory'),

    /**
     * @see module:authentication/services/SessionService
     */
    Session: require('./session_service')
};