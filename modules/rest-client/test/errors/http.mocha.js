var expect = require('chai').expect,
    assert = require('assert'),
    HttpError = require('../../errors/http');

describe('HTTP error', function () {

    it('requires a numeric code', function () {
        var initFn = HttpError.bind(HttpError);
        expect(initFn).to.throw(assert.AssertionError, 'code must be a number');
    });

    it('generates a message with a code', function () {
        var err = new HttpError(404);
        expect(err.code).to.equal(404);
        expect(err.message).to.equal('HTTP error occurred (404 - Not Found)');
        expect(err.description).to.equal('Not Found');
    });

    it('includes details when provided', function () {
        var err = new HttpError(404, 'Requested endpoint not found');
        expect(err.message).to.equal('HTTP error occurred (404 - Not Found): Requested endpoint not found');
        expect(err.details).to.equal('Requested endpoint not found');
    });

    it('extends from Error', function () {
        var err = new HttpError(404);
        expect(err).to.be.an.instanceOf(Error);
    });
});