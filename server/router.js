/**
 * Router
 * @module server/Router
 */

var util = require('util'),
    Router = require('../modules/router-extendable').ExtendableRouter,
    config = require('config'),
    authentication = require('../modules/authentication'),
    githubAuthentication = require('../modules/authentication_github'),
    github = require('../modules/github');

/**
 * @class
 * @extends module:router-extendable/ExtendableRouter
 */
var ServerRouter = function () {
    Router.call(this);

    // TODO modularize the instantiation of various parts 
    // TODO explore configurable dependency injection 

    function getGitHubAuthRouter (githubConfig) {
        var githubClient = new github.services.GitHubClient(githubConfig),
            tokenService = new githubAuthentication.services.Token(githubClient, { github: githubConfig }),
            tokenController = new githubAuthentication.controllers.Token(tokenService);

        return new githubAuthentication.Router(tokenController);
    };

    function getAuthRouter (providers) {
        return new authentication.Router(providers);
    };

    function getAuthProviders () {
        return {
            'github': getGitHubAuthRouter(config.get('github'))
        };
    };

    this.extend('/auth', getAuthRouter(getAuthProviders()));
};

util.inherits(ServerRouter, Router);

module.exports = ServerRouter;