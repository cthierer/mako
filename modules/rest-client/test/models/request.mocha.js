var expect = require('chai').expect,
    sinon = require('sinon'),
    assert = require('assert'),
    util = require('util'),
    events = require('events'),
    errors = require('../../errors'),
    models = require('../../models'),
    Request = models.Request;

describe('Request model', function () {
    var ClientRequest;

    beforeEach(function () {
        ClientRequest = function () {
            this.getHeader = sinon.stub();
            this.setHeader = sinon.stub();
            this.write = sinon.stub();
            this.end = sinon.stub();
        };

        util.inherits(ClientRequest, events.EventEmitter);
    });

    it('requires a client request', function () {
        var initWithNull = Request.bind(Request, null),
            initWithUndef = Request.bind(Request, undefined);

        expect(initWithNull).to.throw(assert.AssertionError, 'clientRequest must not be null');
        expect(initWithUndef).to.throw(assert.AssertionError, 'clientRequest must be defined');
    });

    describe('instantiate model', function () {
        var clientRequest,
            model;

        beforeEach(function () {
            clientRequest = new ClientRequest();
            model = new Request(clientRequest);
        });

        it('is an instance of Message', function () {
            expect(model).to.be.an.instanceOf(models.Message);
        });

        it('retrieves the client request', function () {
            expect(model.getClientRequest()).to.equal(clientRequest);
        });

        it('retrieves the header', function () {
            clientRequest.getHeader.withArgs('x-test').returns('value');

            expect(model.getHeader('x-test')).to.equal('value');
            expect(model.getHeader('x-other')).to.be.undefined;
            expect(clientRequest.getHeader.calledTwice).to.be.true;
        });

        it('is not sent by default', function () {
            expect(model.isSent()).to.be.false;
        });

        describe('setting header', function () {

            it('enforces that key is a string', function () {
                var setFn = model.setHeader.bind(model, 123, 'value');
                expect(setFn).to.throw(assert.AssertionError, 'key must be a string');
            });

            it('enforces that value is a string', function () {
                var setFn = model.setHeader.bind(model, 'key', 123);
                expect(setFn).to.throw(assert.AssertionError, 'value must be a string');
            });

            it('sets the header', function () {
                clientRequest.setHeader.withArgs('test', 'testValue');
                expect(model.setHeader('test', 'testValue')).to.be.undefined;
                expect(clientRequest.setHeader.calledOnce).to.be.true;
            });
        });

        describe('writing body', function () {

            it('must be an instance of body', function () {
                var writeFn = model.writeBody.bind(model, 'a body');
                expect(writeFn).to.throw(assert.AssertionError, 'body must be an instance of Body');
            });

            it('writes an HTTP body', function () {
                var body = new models.Body({ test: 'value' }, 
                        models.ContentType.Factory.get('application/json')),
                    encoded = JSON.stringify({test: 'value'});

                clientRequest.write.withArgs(encoded);
                sinon.stub(body, 'getHttpContent').returns(encoded);

                model.writeBody(body);

                expect(clientRequest.write.calledOnce);
                expect(body.getHttpContent.calledOnce);
            });

            it('sets the content type header', function () {
                var body = new models.Body({test: 'value'},
                        models.ContentType.Factory.get('application/json')),
                    encoded = JSON.stringify({test: 'value'});

                clientRequest.write.withArgs(encoded);
                sinon.stub(body, 'getHttpContent').returns(encoded);
                sinon.stub(model, 'setHeader');

                model.writeBody(body);

                expect(model.setHeader.calledOnce).to.be.true;
                expect(model.setHeader.getCall(0).args[0]).to.equal('content-type');
                expect(model.setHeader.getCall(0).args[1]).to.equal('application/json');
            });
        });

        describe('sending', function () {
            var HttpResponse,
                httpResponse;

            beforeEach(function () {
                HttpResponse = function (contentType, statusCode) { 

                    this.headers = {
                        'content-type': contentType
                    };

                    this.statusCode = statusCode;
                };

                util.inherits(HttpResponse, events.EventEmitter);
            });

            describe('when successful', function () {
                var httpResponse; 

                beforeEach(function () {
                    httpResponse = new HttpResponse('application/json', 200);
                    clientRequest.emit('response', httpResponse);
                    httpResponse.emit('end');
                });

                it('writes body when provided', function (done) {
                    var body = { getHttpContent: sinon.stub() };

                    model.writeBody = sinon.stub();

                    model.send(body).then(function () {
                        expect(model.writeBody.calledOnce).to.be.true;
                        done();
                    });
                });

                it('returns a response', function (done) {
                    model.send().then(function (response) {
                        expect(response).to.be.an.instanceOf(models.Response);
                        expect(response.getCode()).to.equal(200);
                        expect(response.getHeaders()).to.be.an('object')
                            .with.property('content-type', 'application/json');
                        done();
                    });
                });

                it('changes state to be sent', function (done) {
                    model.send().then(function () {
                        expect(model.isSent()).to.be.true;
                        done();
                    });
                });

                it('cannot change headers after being sent', function (done) {
                    model.send().then(function () {
                        var setFn = model.setHeader.bind(model, 'test', 'value');
                        expect(setFn).to.throw(errors.InvalidState, 'request already sent');
                        done();
                    });
                });

                it('cannot write body after being sent', function (done) {
                    model.send().then(function () {
                        var body = new models.Body({ test: 'value' }, 
                                models.ContentType.Factory.get('application/json')),
                            writeFn = model.writeBody.bind(model, body);
                        expect(writeFn).to.throw(errors.InvalidState, 'request already sent');
                        done();
                    });
                });
            });

            it('parses a response body', function (done) {
                var httpResponse = new HttpResponse('application/json', 200);

                clientRequest.emit('response', httpResponse);
                httpResponse.emit('data', JSON.stringify({ test: 'value' }));
                httpResponse.emit('end');

                model.send().then(function (response) {
                    expect(response).to.be.an.instanceOf(models.Response);
                    expect(response.getBody()).to.be.an.instanceOf(models.Body);
                    expect(response.getBody().getRawContent()).to.be.an('object')
                        .with.property('test', 'value');
                    expect(response.getBody().getHttpContent()).to.be.a('string')
                        .that.equals('{"test":"value"}');
                    done();
                });
            });

            describe('when response is an error', function () {
                var httpResponse; 

                it('detects a not found error', function (done) {
                    httpResponse = new HttpResponse('application/json', 404);
                    clientRequest.emit('response', httpResponse);
                    httpResponse.emit('end');

                    model.send().catch(function (err) {
                        expect(err).to.be.an.instanceOf(errors.NotFound);
                        done();
                    });
                });

                it('detects a request error', function (done) {
                    httpResponse = new HttpResponse('application/json', 400);
                    clientRequest.emit('response', httpResponse);
                    httpResponse.emit('end');

                    model.send().catch(function (err) {
                        expect(err).to.be.an.instanceOf(errors.Request);
                        done();
                    });
                });

                it('detects a server error', function (done) {
                    httpResponse = new HttpResponse('application/json', 500);
                    clientRequest.emit('response', httpResponse);
                    httpResponse.emit('end');

                    model.send().catch(function (err) {
                        expect(err).to.be.an.instanceOf(errors.Server);
                        done();
                    });
                });
            });

            it('handles request errors', function () {
                clientRequest.emit('error', new Error('connection error'));

                model.send().catch(function (err) {
                    expect(err).to.be.an.instanceOf(Error);
                });
            });

            it.skip('handles unknown content types', function () {});
        });
    });
});