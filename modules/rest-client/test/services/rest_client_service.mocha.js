var expect = require('chai').expect,
    assert = require('assert'),
    sinon = require('sinon'),
    Promise = require('bluebird'),
    RESTClientService = require('../../services/rest_client_service'),
    models = require('../../models');

describe('REST client service', function () {

    describe('instantiation', function () {
        var options;

        beforeEach(function () {
            options = {
                host: 'www.example.com'
            };
        });

        it('requires options parameter', function () {
            var constructNoArgs = RESTClientService.bind(RESTClientService);
            expect(constructNoArgs).to.throw(assert.AssertionError, 'options must be defined');
        });

        describe('host', function () {
            it('is required', function () {
                var constructNoOptions = RESTClientService.bind(RESTClientService, {});
                expect(constructNoOptions).to.throw(assert.AssertionError, 'host must be provided');
            });

            it('is stored', function () {
                var service = new RESTClientService(options);
                expect(service.getHost()).to.equal(options.host);
            });
        });

        describe('protocol', function () {
            it('defaults to http', function () {
                var service = new RESTClientService(options);
                expect(service.getProtocol()).to.equal('http');
            });

            it('can be specified', function () {
                var service; 

                options.protocol = 'https';
                service = new RESTClientService(options);

                expect(service.getProtocol()).to.equal('https');
            });
        });

        describe('port', function () {
            it('defaults to 80', function () {
                var service = new RESTClientService(options);
                expect(service.getPort()).to.equal(80);
            });

            it('defaults to 443 when protocol is https', function () {
                var service;

                options.protocol = 'https';
                service = new RESTClientService(options);

                expect(service.getPort()).to.equal(443);
            });

            it('can be specified', function () {
                var service;

                options.port = 1234;
                service = new RESTClientService(options);

                expect(service.getPort()).to.equal(options.port);
            });
        });

        describe('path prefix', function () {
            it('defaults to /', function () {
                var service = new RESTClientService(options);
                expect(service.getPathPrefix()).to.equal('/');
            });

            it('can be specified', function () {
                var service;

                options.pathPrefix = '/test/';
                service = new RESTClientService(options);

                expect(service.getPathPrefix()).to.equal('/test/');
            });
        });

        it('can be instantiated', function () {
            var options = { host: 'www.example.com' };
            expect(new RESTClientService(options)).to.be.an.object;
        });
    });

    describe('instantiated service', function () {
        var options,
            service, 
            sandbox;

        before(function () {
            sandbox = sinon.sandbox.create();
        });

        beforeEach(function () {
            options = { 
                host: 'www.example.com',
                port: 1234, 
                protocol: 'https',
                pathPrefix: '/test/'
            };
            service = new RESTClientService(options);
        });

        afterEach(function () {
            sandbox.restore();
        });

        describe('making a request', function () {
            var action,
                request,
                response;

            beforeEach(function () {
                action = sandbox.stub(models.Action.Factory.get('post'));
                request = { send: sandbox.stub() };
                response = {};

                request.send.returns(Promise.resolve(response));
                action.initializeRequest.returns(request);
            });

            it('executes the action', function (done) {
                service.makeRequest(action, '/path/to/endpoint').then(function (result) {
                    expect(action.initializeRequest.calledOnce).to.be.true;
                    expect(request.send.calledOnce).to.be.true;
                    expect(result).to.equal(response);
                    done();
                });
            });

            it('generates the correct path', function (done) {
                service.makeRequest(action, '/path/to/endpoint').then(function () {
                    var initCall = action.initializeRequest.getCall(0),
                        initOptions = initCall.args[0];

                    expect(initOptions).is.an('object')
                        .with.property('pathname', '/test/path/to/endpoint');

                    done();
                });
            });

            it('includes the host and port', function (done) {
                service.makeRequest(action, '/path/to/endpoint').then(function () {
                    var initCall = action.initializeRequest.getCall(0),
                        initOptions = initCall.args[0];

                    expect(initOptions).is.an('object');
                    expect(initOptions).to.have.property('hostname', options.host);
                    expect(initOptions).to.have.property('port', options.port);

                    done();
                });
            });

            it('includes custom headers', function (done) {
                var options = {};

                options.headers = {
                    'test': 'value1'
                };

                service.makeRequest(action, '/path/to/endpoint', options).then(function () {
                    var initCall = action.initializeRequest.getCall(0),
                        initOptions = initCall.args[0];

                    expect(initOptions).is.an('object')
                        .with.property('headers').that.is.an('object');

                    for (var key in options.headers) {
                        var value = options.headers[key];
                        expect(initOptions.headers).to.have.property(key, value);
                    }

                    done();
                });
            });

            it('includes custom parameters', function (done) {
                var options = {};

                options.parameters = {
                    'test': 'value1'
                };

                service.makeRequest(action, '/path/to/endpoint', options).then(function () {
                    var initCall = action.initializeRequest.getCall(0),
                        initOptions = initCall.args[0];

                    expect(initOptions).is.an('object')
                        .with.property('parameters').that.is.an('object');

                    for (var key in options.parameters) {
                        var value = options.parameters[key];
                        expect(initOptions.parameters).to.have.property(key, value);
                    }

                    done();
                });
            });

            it('provides a body', function (done) {
                var options = {};

                options.body = JSON.stringify({ 
                    test: 'value1' 
                });

                service.makeRequest(action, '/path/to/endpoint', options).then(function () {
                    var initCall = action.initializeRequest.getCall(0),
                        initOptions = initCall.args[0],
                        sendCall = request.send.getCall(0);

                    expect(initOptions).is.an('object').not.with.property('body');
                    expect(sendCall.args[0]).to.equal(options.body);

                    done();
                });
            });

            it('authenticates and refreshes a session', function (done) {
                var session = new models.Session();

                sandbox.stub(session, 'authenticate').returnsArg(0);
                sandbox.stub(session, 'refresh').returnsArg(0);

                sandbox.stub(service, 'hasSession').returns(true);
                sandbox.stub(service, 'getSession').returns(session);

                service.makeRequest(action, '/path/to/endpoint').then(function () {
                    expect(session.authenticate.calledOnce).to.be.true;
                    expect(session.authenticate.calledWith(request)).to.be.true;
                    expect(session.refresh.calledOnce).to.be.true;
                    expect(session.refresh.calledWith(response)).to.be.true;
                    done();
                });
            });
        });

        describe('session management', function () {
            it('enforces that session is an instance of Session', function () {
                var setFn = service.setSession.bind(service, {});
                expect(setFn).to.throw(assert.AssertionError, 'newSession must be a Session');
            });

            it('has an undefined session by default', function () {
                expect(service.getSession()).to.be.undefined;
            });

            it('does not have a session by default', function () {
                expect(service.hasSession()).to.be.false;
            });

            it('clears the unset session', function () {
                expect(service.clearSession()).to.be.undefined;
            });

            describe('setting a session', function () {
                var session;

                beforeEach(function () {
                    session = new models.Session();
                    service.setSession(session);
                });

                it('can retrieve the set session', function () {
                    expect(service.getSession()).to.equal(session);
                });

                it('can determine if there is a session', function () {
                    expect(service.hasSession()).to.be.true;
                });

                it('can clear the session', function () {
                    expect(service.clearSession()).to.equal(session);
                    expect(service.getSession()).to.be.null;
                });
            });
        });
    });
});