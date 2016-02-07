/**
 * @module authentication/controllers/SessionController
 */

var querystring = require('querystring'),
    _ = require('lodash'),
    restify = require('restify'),
    hyperjson = require('hyperjson');

/**
 * @class
 * @param {module:authentication/services/SessionService} sessionService (required)
 * @param {module:authentication/services/ProviderFactory} providerFactory (required)
 */
var SessionController = function (sessionService, providerFactory) {

    /**
     * @returns {module:authentication/services/ProviderFactory}
     */
    this.getProviderFactory = function () {
        return providerFactory;
    };

    /**
     * @param {restify.Request} req
     * @param {restify.Response} res
     * @param {function} next 
     */ 
    this.createSession = function (req, res, next) {
        var providerStr = req.params['provider'],
            provider;

        // validate that provider is a legal value 
        if (!providerFactory.has(providerStr)) {
            next(new restify.InvalidContentError('provider is not recognized'));
            return;
        }

        provider = providerFactory.get(providerStr);

        sessionService.createSession(providerStr).then(function (id) {
            var response = hyperjson({
                'id': id,
                'provider': {
                    name: provider.name,
                    configuration: provider.configuration
                }
            });

            // TODO need to encapsulate this 
            if (_.has(provider.configuration, 'auth_uri')) {
                var authUrl = provider.configuration['auth_uri'];

                authUrl += '?' + querystring.stringify({
                    'client_id': provider.configuration['client_id'],
                    'state': id
                });

                response.link('provider:auth', authUrl);
            }

            res.send(response.toObject());
        }).catch(function (err) {
            res.send(err);
        }).finally(function () {
            next();
        });
    };
};

module.exports = SessionController;