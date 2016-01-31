var expect = require('chai').expect,
    RequestError = require('../../errors/request'),
    NotFoundError = require('../../errors/not_found');

describe('Not Found error', function () {

    it('inherits from Request error', function () {
        var err = new NotFoundError();
        expect(err).to.be.an.instanceOf(RequestError);
    });

    it('sets the 404 status code', function () {
        var err = new NotFoundError();
        expect(err.code).to.equal(404);
    });

    it('provides details', function () {
        var err = new NotFoundError('Lorem ipsum');
        expect(err.details).to.equal('Lorem ipsum');
    });
});