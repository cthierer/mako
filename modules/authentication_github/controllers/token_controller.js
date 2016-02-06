/**
 * Token Controller
 * @module authentication_github/controllers/TokenController
 */

var assert = require('assert'),
    _ = require('lodash'),
    TokenService = require('../services').Token;

/**
 * @class
 * @param {module:authentication_github/services/TokenService} tokenService (required)
 */
var TokenController = function (tokenService) {
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
            res.send(result);
        }).catch(function (err) {
            res.send(err);
        }).finally(function () {
            next();
        });        
    };

};

module.exports = TokenController;