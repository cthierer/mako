/**
 * Router
 * @module server/Router
 */

var util = require('util'),
    Router = require('../modules/router-extendable').ExtendableRouter,
    config = require('config'),
    authentication = require('../modules/authentication'),
    database = require('../modules/database'),
    githubAuthentication = require('../modules/authentication_github'),
    github = require('../modules/github');

/**
 * @class
 * @extends module:router-extendable/ExtendableRouter
 */
var ServerRouter = function () {
    var dataService = new database.DataService(config.get('database')),
        sessionService;

    Router.call(this);

    authentication.models.registerAll(dataService);

    sessionService = new authentication.services.Session(dataService)

    // TODO modularize the instantiation of various parts 
    // TODO explore configurable dependency injection 

    /* ----------------------------------------------------------------------
     * Auth-related routers
     * ---------------------------------------------------------------------- */

    function getGitHubAuthRouter (githubConfig) {
        var githubClient = new github.services.GitHubClient(githubConfig),
            tokenService = new githubAuthentication.services.Token(githubClient, { github: githubConfig }),
            tokenController = new githubAuthentication.controllers.Token(tokenService, sessionService);

        return new githubAuthentication.Router(tokenController);
    };

    function getAuthProviders () {
        var providerFactory = new authentication.services.ProviderFactory();

        // TODO encapsulate the configuration object definition 
        providerFactory.add('github',{
            'client_id' : config.get('github.oauth.client_id'),
            'auth_uri': config.get('github.oauth.auth_uri')
        }, getGitHubAuthRouter(config.get('github')));

        return providerFactory;
    };

    function getSessionController () {
        return new authentication.controllers.Session(sessionService, getAuthProviders());
    };

    function getAuthRouter (sessionController) {
        return new authentication.Router(sessionController);
    };

    /* ----------------------------------------------------------------------
     * Mount routers
     * ---------------------------------------------------------------------- */

    this.extend('/auth', getAuthRouter(getSessionController()));
};

util.inherits(ServerRouter, Router);

module.exports = ServerRouter;