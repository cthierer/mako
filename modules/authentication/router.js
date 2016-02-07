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
 * @param {module:authentication/controllers/SessionController} sessionController (required)
 */
var AuthRouter = function (sessionController) {
    assert(_.isObject(sessionController) && sessionController,
        'sessionController must be defined');

    Router.call(this);

    // register providers
    sessionController.getProviderFactory().mountAll(this);

    // register controllers
    this.post('/sessions', sessionController.createSession.bind(sessionController));
};

util.inherits(AuthRouter, Router);

module.exports = AuthRouter;