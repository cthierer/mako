var expect = require('chai').expect,
    ServiceError = require('../../errors/service');

describe('service error', function () {

    describe('successful instantiation', function () {
        var innerMessage = { 'message': 'An error occurred' },
            errorMessage = { 'message': JSON.stringify(innerMessage) },
            testError;

        beforeEach(function () {
            testError = new ServiceError(errorMessage);
        });

        it('extends from Error', function () {
            expect(testError).to.be.an.instanceOf(Error);
        });

        it('extracts the encapsulated message', function () {
            expect(testError).to.have.a.property('message', innerMessage.message);
        });
    });

    it('handles an incomplete service error', function () {
        var errorMessage = { 'message': 'An error occurred' },
            testError = new ServiceError(errorMessage);

        expect(testError).to.have.a.property('message', errorMessage.message);
    });

    it('handles missing error message', function () {
        var testError = new ServiceError();

        expect(testError).to.have.property('message').that.is.undefined;
    });
});
