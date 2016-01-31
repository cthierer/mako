var expect = require('chai').expect,
    InvalidStateError = require('../../errors/invalid_state');

describe('Invalid State error', function () {

    it('sets a message', function () {
        var err = new Error('Lorem ipsum');
        expect(err.message).to.equal('Lorem ipsum');
    });

    it('inherits from error', function () {
        var err = new Error('Lorem ipsum');
        expect(err).to.be.an.instanceOf(Error);
    });
});