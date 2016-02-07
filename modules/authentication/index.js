/**
 * Authentication module 
 * @module authentication
 */

module.exports = {

    controllers: require('./controllers'),

    models: require('./models'),

    services: require('./services'),

    /**
     * @see module:authentication/Router
     */
    Router: require('./router')
};