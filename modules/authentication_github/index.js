/**
 * GitHub Authentication
 * @module authentication_github
 */
module.exports = {

    /**
     * @see module:authentication_github/controllers
     */
    controllers: require('./controllers'),

    /**
     * @see module:authentication_github/services
     */
    services: require('./services'),

    /**
     * @see module:authentication_github/router
     */
    Router: require('./router')
    
};