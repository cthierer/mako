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
 * @param {module:authentication/services/ProviderFactory} providerFactory (required)
 * @param {module:authentication/controllers/SessionController} sessionController (required)
 */
var AuthRouter = function (providerFactory, sessionController) {
    assert(_.isObject(providerFactory) && providerFactory, 
        'providerFactory must be an object with at least one mapping');
    assert(_.isObject(sessionController) && sessionController,
        'sessionController must be defined');

    Router.call(this);

    // register providers
    providerFactory.mountAll(this);

    // register controllers
    this.post('/sessions', sessionController.createSession.bind(sessionController));
};

util.inherits(AuthRouter, Router);

module.exports = AuthRouter;