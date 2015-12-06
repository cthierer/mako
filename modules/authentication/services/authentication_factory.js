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
        assert(_.isString(name), 'name must be a string');
        assert(_.has(authenticators, name), 'authenticator must exist');

        return authenticators[name];
    }

    this.add = addAuthenticator;
    this.get = getAuthenticator;
};

module.exports = new AuthenticationFactory();
