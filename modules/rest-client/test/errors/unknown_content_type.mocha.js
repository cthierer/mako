var expect = require('chai').expect,
    UnknownContentType = require('../../errors/unknown_content_type');

describe('Unknown Content Type error', function () {

    it('inherits from Error', function () {
        var err = new UnknownContentType('lorem/ipsum');
        expect(err).to.be.an.instanceOf(Error);
    });

    it('builds a message', function () {
        var err = new UnknownContentType('lorem/ipsum');
        expect(err.message).to.equal('Unknown content type specified: "lorem/ipsum"');
        expect(err.contentType).to.equal('lorem/ipsum');
    });
});