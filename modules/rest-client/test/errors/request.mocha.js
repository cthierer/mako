var expect = require('chai').expect,
    HttpError = require('../../errors/http'),
    RequestError = require('../../errors/request');

describe('Request error', function () {

    it('extends from HTTP error', function () {
        var err = new RequestError(404);
        expect(err).to.be.an.instanceOf(HttpError);
        expect(err.code).to.equal(404);
    });

    it('allows for details to be specified', function () {
        var err = new RequestError(404, 'lorem ipsum');
        expect(err.details).to.equal('lorem ipsum');
    });
});