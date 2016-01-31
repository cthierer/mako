var expect = require('chai').expect,
    sinon = require('sinon'),
    assert = require('assert'),
    models = require('../../models'),
    ContentType = models.ContentType;

describe('Content Type model', function () {

    it('requires a value', function () {
        var initFn = ContentType.bind(ContentType, null);
        expect(initFn).to.throw(assert.AssertionError, 'value must be a string');
    });

    it('defaults synonyms when not provided', function () {
        var model = new ContentType('test');
        expect(model.getSynonyms()).to.be.an('array').with.length(0);
    });

    describe('instantiated model', function () {
        var value,
            model; 

        beforeEach(function () {
            value = 'test';
            model = new ContentType(value, {
                synonyms: ['text/test']
            });
        });

        it('retrieves the value', function () {
            expect(model.getValue()).equals(value);
        });

        it('retrieves the synonyms', function () {
            expect(model.getSynonyms()).to.be.an('array')
                .with.length(1)
                .that.contains('text/test');
        });

        describe('comparing against another message', function () {

            it('handles when the content type matches value', function () {
                var message = { getHeader: sinon.stub() };
                message.getHeader.withArgs('content-type').returns(value);
                expect(model.matches(message)).to.be.true;
            });

            it('handles when the content type does not match value', function () {
                var message = { getHeader: sinon.stub() };
                message.getHeader.withArgs('content-type').returns('application/json');
                expect(model.matches(message)).to.be.false; 
            });

            it('handles when the content type matches a synonym', function () {
                var message = { getHeader: sinon.stub() };
                message.getHeader.withArgs('content-type').returns('text/test');
                expect(model.matches(message)).to.be.true;
            });
        });

        describe('comparing against a string', function () {

            it('handles when the provided value matches the value', function () {
                expect(model.matchesValue(value)).to.be.true;
            });

            it('handles when the provided value does not match the value', function () {
                expect(model.matchesValue('application/json')).to.be.false;
            });

            it('handles when the content type matches a synonym', function () {
                expect(model.matchesValue('text/test')).to.be.true;
            });

            it('ignores value case', function () {
                expect(model.matchesValue(value.toUpperCase())).to.be.true;
                expect(model.matchesValue('TEXT/TEST')).to.be.true;
            });
        });

        it('sets the content type on a request', function () {
            var request = { setHeader: sinon.stub() };  

            request.setHeader.withArgs('content-type', value);

            expect(model.setContentType(request)).to.equal(request);
            expect(request.setHeader.calledOnce).to.be.true;
        });

        it('defines the encode method', function () {
            var encodeFn = model.encode.bind(model);
            expect(encodeFn).to.throw(Error, 'not implemented');
        });

        it('defines the decode method', function () {
            var decodeFn = model.decode.bind(model);
            expect(decodeFn).to.throw(Error, 'not implemented');
        });
    });

    describe('factory', function () {

        it('only allows putting a ContentType', function () {
            var putFn = ContentType.Factory.put.bind(ContentType.Factory, {});
            expect(putFn).to.throw(assert.AssertionError, 'value must be a ContentType');
        });

        describe('adding a value', function () {
            var contentType;

            beforeEach(function () {
                contentType = new ContentType('test');
                ContentType.Factory.put('test-key', contentType);
            });

            it('retrieves the put value', function () {
                expect(ContentType.Factory.get('test-key')).to.equal(contentType);
            });

            describe('finding a match', function () {

                it('validates a string', function () {
                    var findFn = ContentType.Factory.findMatch.bind(ContentType.Factory, 123);
                    expect(findFn).to.throw(assert.AssertionError, 'forValue must be a string');
                });

                it('finds a match', function () {
                    expect(ContentType.Factory.findMatch('test')).to.equal(contentType);
                    expect(ContentType.Factory.findMatch('test1')).to.be.undefined;
                });
            });
        });
    });
});
