var expect = require('chai').expect,
    errorsUtil = require('../../utils/errors');

describe('errors utility', function () {

    describe('extracting an error message', function () {

        it('returns the error\'s message when available', function () {
            var sample = { 'message': 'Lorem ipsum' },
                response = errorsUtil.getErrorMessage(sample);

            expect(response).to.equal('Lorem ipsum');
        });

        it('parses the message as JSON', function () {
            var sample = { 'message': JSON.stringify({ 'message': 'Lorem ipsum' }) },
                response = errorsUtil.getErrorMessage(sample);

            expect(response).to.equal('Lorem ipsum');
        });

        it('handles if the parameter does not have a message attribute', function () {
            var sample = { 'test': 'Lorem ipsum' },
                response = errorsUtil.getErrorMessage(sample);

            expect(response).to.be.undefined;
        });

        it('handles if the parameter is not defined', function () {
            expect(errorsUtil.getErrorMessage()).to.be.undefined;
            expect(errorsUtil.getErrorMessage(null)).to.be.undefined;
            expect(errorsUtil.getErrorMessage({})).to.be.undefined;
        });
    });
});
