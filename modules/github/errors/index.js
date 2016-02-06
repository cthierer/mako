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
      * GitHub error.
      * @see module:github/errors/GitHubError
      */
     GitHub: require('./github_error'),

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
