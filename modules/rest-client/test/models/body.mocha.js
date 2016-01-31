var expect = require('chai').expect,
    sinon = require('sinon'),
    assert = require('assert'),
    models = require('../../models'),
    Body = models.Body;

describe('Body model', function () {

    it('requires rawContent', function () {
        var initFn = Body.bind(Body);
        expect(initFn).to.throw(assert.AssertionError, 'rawContent must be an object');
    });

    it('requires contentType', function () {
        var initFn = Body.bind(Body, {});
        expect(initFn).to.throw(assert.AssertionError, 'contentType must be a ContentType')
    });

    describe('instantiated model', function () {
        var rawContent, 
            contentType, 
            model;

        beforeEach(function () {
            rawContent = {};
            contentType = new models.ContentType('test');
            model = new Body(rawContent, contentType);
        });

        it('retrieves encoded content', function () {
            sinon.stub(contentType, 'encode').returns(JSON.stringify(rawContent));

            expect(model.getHttpContent()).to.be.a('string').that.equals(JSON.stringify(rawContent)); 
            expect(contentType.encode.calledOnce).to.be.true;
        });

        it('returns raw content', function () {
            expect(model.getRawContent()).to.be.a('object').that.equals(rawContent);
        });

        it('returns the content type', function () {
            expect(model.getContentType()).to.equal(contentType);
        });
    });
});