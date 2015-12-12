var expect = require('chai').expect,
    AuthenticationError = require('../../errors/authentication');

describe('authentication error', function () {

    describe('successful instantiation', function () {
        var testError;

        beforeEach(function () {
            testError = new AuthenticationError('octocat', 'Invalid password');
        });

        it('extends from Error', function () {
            expect(testError).to.be.an.instanceOf(Error);
        });

        it('stores the username', function () {
            expect(testError).to.have.property('username', 'octocat');
        });

        it('stores the original message', function () {
            expect(testError).to.have.property('error', 'Invalid password');
        });

        it('generates a complete error message', function () {
            expect(testError).to.have.property('message',
                'Error authenticating user "octocat": Invalid password');
        });
    });

    describe('missing error description', function () {
        var testError;

        beforeEach(function () {
            testError = new AuthenticationError('octocat');
        });

        it('does not initialize the original message', function () {
            expect(testError).to.have.property('error').that.is.undefined;
        });

        it('generates a partial error message including the name', function () {
            expect(testError).to.have.property('message',
                'Error authenticating user "octocat"');
        });
    });

    describe('missing username', function () {
        var testError;

        beforeEach(function () {
            testError = new AuthenticationError(undefined, 'Invalid password');
        });

        it('does not initialize the username', function () {
            expect(testError).to.have.property('username').that.is.undefined;
        });

        it('generates a partial error message including the error', function () {
            expect(testError).to.have.property('message',
                'Error authenticating user: Invalid password');
        });
    });

    it('uses a standard authentication message', function () {
        var testError = new AuthenticationError();
        expect(testError).to.have.property('message', 'Error authenticating user');
    });
});
