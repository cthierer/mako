var expect = require('chai').expect,
    HttpError = require('../../errors/http'),
    ServerError = require('../../errors/server');

describe('Server error', function () {

    it('extends from HTTP error', function () {
        var err = new ServerError(500);
        expect(err).to.be.an.instanceOf(HttpError);
        expect(err.code).to.equal(500);
    });

    it('allows for details to be set', function () {
        var err = new ServerError(500, 'lorem ipsum');
        expect(err.details).to.equal('lorem ipsum');
    });
});