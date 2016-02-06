var expect = require('chai').expect, 
    GitHubError = require('../../errors/github_error');

describe('GitHub error', function () {

    describe('instantiating with error object', function () {
        var errorObj,
            instance;

        beforeEach(function () {
            errorObj = {
                error: 'bad_verification_code',
                error_description: 'The code passed is incorrect or expired.',
                error_uri: 'https://developer.github.com/v3/oauth/#bad-verification-code'
            };

            instance = new GitHubError(errorObj);
        });

        it('parses the message', function () {
            expect(instance).to.have.property('message', errorObj['error_description']);
        });

        it('parses the error code', function () {
            expect(instance).to.have.property('errorCode', errorObj['error']);
        });

        it('parses the error URI', function () {
            expect(instance).to.have.property('errorURI', errorObj['error_uri']);
        });
    });

    it('uses the error message when not provided', function () {
        var instance = new GitHubError();
        expect(instance).to.have.property('message', 'Unknown GitHub error');
        expect(instance).to.have.property('errorCode').to.be.undefined;
        expect(instance).to.have.property('errorURI').to.be.undefined;
    });
});