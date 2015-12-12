/**
 * Errors
 * @module github/errors
 */

 module.exports = {

     /**
      * Authentication failure.
      * @see module:github/errors/Authentication
      */
     Authentication: require('./authentication'),

     /**
      * Resource not found failure.
      * @see module:github/errors/NotFound
      */
     NotFound: require('./not_found'),

     /**
      * External service failure.
      * @see module:github/errors/Service
      */
     Service: require('./service')
 }
