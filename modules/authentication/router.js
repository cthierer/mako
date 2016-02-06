/**
 * Router
 * @module authentication/Router
 */

var util = require('util'),
    assert = require('assert'),
    _ = require('lodash'),
    Router = require('../router-extendable').ExtendableRouter,
    githubAuth = require('../authentication_github');

/**
 * @class
 * @extends module:router-extendable/ExtendableRouter
 * @param {object} providers (required)
 */
var AuthRouter = function (providers) {
    assert(_.isObject(providers) && !_.isEmpty(providers), 
        'providers must be an object with at least one mapping');

    Router.call(this);

    // register router in providers
    for (var name in providers) {
        var router = providers[name];
        assert(router instanceof Router, 'router must be an Extendable Router');
        this.extend(name, router);
    }
};

util.inherits(AuthRouter, Router);

module.exports = AuthRouter;