/**
 * Router
 * @module authentication_github/Router
 */

var util = require('util'),
    assert = require('assert'),
    Router = require('../router-extendable').ExtendableRouter,
    controllers = require('./controllers');

/**
 * @class
 * @extends module:router-extendable/ExtendableRouter
 * @param {module:authentication_github/controllers/TokenController} tokenController (required)
 */
var GitHubAuthRouter = function (tokenController) {
    assert(tokenController instanceof controllers.Token,
        'tokenController must be an instance of Token Controller');

    Router.call(this);

    this.get('/token', tokenController.createToken.bind(tokenController));
};

util.inherits(GitHubAuthRouter, Router);

module.exports = GitHubAuthRouter;