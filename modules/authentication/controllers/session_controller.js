/**
 * @module authentication/controllers/SessionController
 */

var restify = require('restify');

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
        var provider = req.params['provider'];

        // validate that provider is a legal value 
        if (!providerFactory.has(provider)) {
            next(new restify.InvalidContentError('provider is not recognized'));
            return;
        }

        sessionService.createSession(provider).then(function (id) {
            // TODO want to also include other info for provider, like client id
            res.send({
                'id': id
            });
        }).catch(function (err) {
            res.send(err);
        }).finally(function () {
            next();
        });
    };
};

module.exports = SessionController;