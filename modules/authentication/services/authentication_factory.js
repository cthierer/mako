var _ = require('lodash'),
    assert = require('assert');

var AuthenticationFactory = function () {
    var authenticators = {};

    function addAuthenticator (name, authenticator) {
        assert(_.isString(name), 'name must be a string');
        assert(_.isObject(authenticator), 'authenticator must be an object');
        assert(_.isFunction(authenticator.authenticate), 'authenticator must be able to authenticate');

        authenticators[name] = authenticator;
        return true;
    }

    function getAuthenticator (name) {
        assert(hasAuthenticator(name), 'authenticator must exist');
        return authenticators[name];
    }

    function hasAuthenticator (name) {
        assert(_.isString(name), 'name must be a string');
        return _.has(authenticators, name);
    }

    this.add = addAuthenticator;
    this.get = getAuthenticator;
    this.has = hasAuthenticator;
};

module.exports = new AuthenticationFactory();
