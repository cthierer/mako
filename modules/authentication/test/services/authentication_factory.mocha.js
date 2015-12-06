var expect = require('chai').expect,
    assert = require('assert'),
    authenticationFactory = require('../../services/authentication_factory');

describe('authentication factory', function () {

    describe('adding authenticator', function () {

        it('adds a named authenticator', function () {
            var authenticator = { authenticate: function () {} },
                result = authenticationFactory.add('test',authenticator);
            expect(result).to.be.true;
        });

        it('throws an error when the authenticator is invalid', function () {
            var addFn = authenticationFactory.add.bind(authenticationFactory,
                'test', {});
            expect(addFn).to.throw(assert.AssertionError, 'authenticator must be able to authenticate');
        });

        it('throws an error when no authenticator is provided', function () {
            var addFn = authenticationFactory.add.bind(authenticationFactory, 'test');
            expect(addFn).to.throw(assert.AssertionError, 'authenticator must be an object');
        });

        it('throws an error when no name is provided', function () {
            var addFn = authenticationFactory.add.bind(authenticationFactory, {});
            expect(addFn).to.throw(assert.AssertionError, 'name must be a string');
        });
    });

    describe('retrieving authenticator', function () {
        var name, authenticator;

        beforeEach(function () {
            name = 'testAuthenticator';
            authenticator = { authenticate: function () {} };

            authenticationFactory.add(name, authenticator);
        });

        it('retrieves a named authenticator', function () {
            var result = authenticationFactory.get(name);
            expect(result).to.equal(authenticator);
        });

        it('throws an error when an unknown authenticator is requsted', function () {
            var getFn = authenticationFactory.get.bind(authenticationFactory, 'jibjab');
            expect(getFn).to.throw(assert.AssertionError, 'authenticator must exist');
        });

        it('throws an error when a bad name is provided', function () {
            var getFn = authenticationFactory.get.bind(authenticationFactory);
            expect(getFn).to.throw(assert.AssertionError, 'name must be a string');
        });
    });

    describe('checking for authenticator', function () {
        var name;

        beforeEach(function () {
            name = 'testAuthenticator';
            authenticationFactory.add(name, { authenticate: function () {} });
        });

        it('returns true when authenticator exists', function () {
            expect(authenticationFactory.has(name)).to.be.true;
        });

        it('returns false when authenticator does not exist', function () {
            expect(authenticationFactory.has('jibjab')).to.be.false;
        });

        it('throws an error when name is not a string', function () {
            var hasFn = authenticationFactory.has.bind(authenticationFactory);
            expect(hasFn).to.throw(assert.AssertionError, 'name must be a string');
        });
    });
});
