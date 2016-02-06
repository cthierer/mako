/**
 * Extendable Router
 * @module router-extendable/ExtendableRouter
 */

var assert = require('assert'),
    util = require('util'),
    path = require('path').posix,
    logger = require('log4js').getLogger(),
    _ = require('lodash'),
    Router = require('restify-router').Router;

/**
 * Extends the Restify Router class to allow routers to be chained together. 
 * @class
 * @extends restify-router.Router 
 * @todo Router supports using Regular Expressions; these prefixes all use 
 *  strings. Test using strings in cojunction with Regular Expressions. 
 */
var ExtendableRouter = function () {
   Router.call(this);

   this.nextRouters = [];
};

util.inherits(ExtendableRouter, Router);

/**
 * Chains another router to this router, prefixed with the specified string. 
 * @param {string} prefix 
 * @param {ExtendableRouter} router 
 */
ExtendableRouter.prototype.extend = function (prefix, router) {
    assert(_.isString(prefix) && !_.isEmpty(prefix), 'prefix must be a non-empty string');
    assert(router instanceof ExtendableRouter, 'router must be an Extendable Router');

    this.nextRouters.push({
        prefix: prefix, 
        router: router
    });
};

/**
 * Registers the routes for this router with the server. Uses the prefix to 
 * augment the given routes. Applies that prefix to chained routers. 
 * @param {restify.Server} server 
 * @param {string} prefix (optional) 
 */
ExtendableRouter.prototype.apply = function (server, prefix) {
    prefix = path.join('/', prefix || '');

    if (logger.isDebugEnabled()) {
        logger.debug('Applying routes', 
            (prefix ? 'with prefix ' + prefix : '(no prefix)...'));
    }

    this.applyRoutes(server, prefix);

    for (var i = 0; i < this.nextRouters.length; i++) {
        var nextRouter = this.nextRouters[i],
            nextPrefix = nextRouter.prefix || '',
            mergedPrefix = path.join(prefix, nextPrefix);

        if (logger.isDebugEnabled()) {
            logger.debug('Chaining router to prefix', mergedPrefix);
        }

        nextRouter.router.apply(server, mergedPrefix);
    }
};

module.exports = ExtendableRouter;