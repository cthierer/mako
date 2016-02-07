/**
 * Token Controller
 * @module authentication_github/controllers/TokenController
 */

var assert = require('assert'),
    querystring = require('querystring'),
    _ = require('lodash'),
    TokenService = require('../services').Token;

/**
 * @class
 * @param {module:authentication_github/services/TokenService} tokenService (required)
 * @param {module:authentication/services/SessionService} sessionService (required)
 */
var TokenController = function (tokenService, sessionService) {
    assert(!_.isNull(tokenService) && !_.isUndefined(tokenService), 
        'tokenService must be defined');

    /**
     * @param {restify.Request} req
     * @param {restify.Response} res
     * @param {function} next
     */
    this.createToken = function (req, res, next) {
        var code = req.query['code'],
            state = req.query['state'];

        tokenService.createToken(code, state).then(function (result) {
            return sessionService.activateSession(state, result.accessToken)
                .then(function (session) {
                    // TODO find better way to redirect/render an HTML page
                    res.header('Location', '/app/auth_success.html#' + 
                        querystring.stringify(session));
                    res.send(303, session);
                });
        }).catch(function (err) {
            res.send(err);
        }).finally(function () {
            next();
        });        
    };

};

module.exports = TokenController;