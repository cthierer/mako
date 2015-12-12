var expect = require('chai').expect,
    NotFoundError = require('../../errors/not_found');

describe('not found error', function () {

    describe('successful instantiation', function () {
        var testError;

        beforeEach(function () {
            testError = new NotFoundError('/test/resource', 'Not found');
        });

        it('extends from Error', function () {
            expect(testError).to.be.an.instanceOf(Error);
        });

        it('stores the resource', function () {
            expect(testError).to.have.property('resource', '/test/resource');
        });

        it('stores the original message', function () {
            expect(testError).to.have.property('error', 'Not found');
        });

        it('generates a complete error message', function () {
            expect(testError).to.have.property('message',
                'Unable to find the expected resource ("/test/resource"): Not found');
        });
    });

    describe('missing error description', function () {
        var testError;

        beforeEach(function () {
            testError = new NotFoundError('/test/resource');
        });

        it('does not initialize the original message', function () {
            expect(testError).to.have.property('error').that.is.undefined;
        });

        it('generates a partial error message including the resource', function () {
            expect(testError).to.have.property('message',
                'Unable to find the expected resource ("/test/resource")');
        });
    });

    describe('missing resource', function () {
        var testError;

        beforeEach(function () {
            testError = new NotFoundError(undefined, 'Not found');
        });

        it('does not initialize the resource', function () {
            expect(testError).to.have.property('resource').that.is.undefined;
        });

        it('generates a partial error message including the error', function () {
            expect(testError).to.have.property('message',
                'Unable to find the expected resource: Not found');
        });
    });

    it('uses a standard not found message', function () {
        var testError = new NotFoundError();
        expect(testError).to.have.property('message',
            'Unable to find the expected resource');
    });
});
