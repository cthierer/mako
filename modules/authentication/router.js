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
 * @param {module:authentication/controllers/SessionController} sessionController (required)
 */
var AuthRouter = function (providers, sessionController) {
    assert(_.isObject(providers) && !_.isEmpty(providers), 
        'providers must be an object with at least one mapping');
    assert(_.isObject(sessionController) && sessionController,
        'sessionController must be defined');

    Router.call(this);

    // register router in providers
    for (var name in providers) {
        var router = providers[name];
        assert(router instanceof Router, 'router must be an Extendable Router');
        this.extend(name, router);
    }

    this.post('/sessions', sessionController.createSession.bind(sessionController));
};

util.inherits(AuthRouter, Router);

module.exports = AuthRouter;