var expect = require('chai').expect, 
    sinon = require('sinon'),
    assert = require('assert'),
    Promise = require('bluebird'),
    errors = require('../../../../errors'),
    restClient = require('../../../../../rest-client'),
    OAuthServiceHelper = require('../../../../services/helpers/v3/oauth_service'),
    restClient = require('../../../../../rest-client'),
    Action = restClient.models.Action,
    HttpError = restClient.errors.HTTP;

describe('oauth service helper', function () {

    it('initializes connection parameters', function () {
        var options = {},
            helper;

        options['github'] = {
            protocol: 'https',
            port: 443, 
            host: 'https://www.github.com'
        };

        helper = new OAuthServiceHelper(options);

        expect(helper).to.exist;
        expect(helper.getProtocol()).to.equal(options.github.protocol);
        expect(helper.getPort()).to.equal(options.github.port);
        expect(helper.getPathPrefix()).to.equal('/login/oauth');
        expect(helper.getHost()).to.equal(options.github.host);
    });

    it('correctly generates the path prefix on initialization', function () {
        var options = {},
            helper;

        options['github'] = {
            pathPrefix: '/api',
            host: 'https://www.github.com'
        };

        helper = new OAuthServiceHelper(options);

        expect(helper.getPathPrefix()).to.equal('/api/login/oauth');
    });

    describe('instantiated helper', function () {
        var options, 
            helper; 

        beforeEach(function () {
            options = { github: { host: 'https://www.github.com' }};
            helper = new OAuthServiceHelper(options);
        });

        describe('creating an access token', function () {

            it('requires a client ID', function () {
                var createFn = helper.createAccessToken.bind(helper, '');
                expect(createFn).to.throw(assert.AssertionError, 'clientId must be a non-empty string');
            });

            it('enforces that client ID is a string', function () {
                var createFn = helper.createAccessToken.bind(helper, 123);
                expect(createFn).to.throw(assert.AssertionError, 'clientId must be a non-empty string');
            });

            it('requires a client secret', function () {
                var createFn = helper.createAccessToken.bind(helper, '123', '');
                expect(createFn).to.throw(assert.AssertionError, 'clientSecret must be a non-empty string');
            });

            it('enforces that client secret is a string', function () {
                var createFn = helper.createAccessToken.bind(helper, '123', 456);
                expect(createFn).to.throw(assert.AssertionError, 'clientSecret must be a non-empty string');
            });

            it('requires a code', function () {
                var createFn = helper.createAccessToken.bind(helper, '123', '456', '');
                expect(createFn).to.throw(assert.AssertionError, 'code must be a non-empty string');
            });

            it('enforces that code is a string', function () {
                var createFn = helper.createAccessToken.bind(helper, '123', '456', 789);
                expect(createFn).to.throw(assert.AssertionError, 'code must be a non-empty string');
            });

            describe('request with successful response', function () {
                var githubResponse, 
                    body, 
                    response, 
                    request;

                beforeEach(function () {
                    // TODO pull from a resource JSON file
                    githubResponse = {
                        'token_type': 'bearer',
                        'scope': 'repo,gist',
                        'access_token': '1234567890'
                    };
                    

                    // stubbing out the components from the REST client module 
                    // these should all be unit tested in the module itself 
                    body = { getRawContent: sinon.stub().returns(githubResponse) };
                    response = { getBody: sinon.stub().returns(body) };
                    request = sinon.stub(helper, 'makeRequest').returns(Promise.resolve(response));
                });

                it('is a POST request', function (done) {
                    helper.createAccessToken('123', '456', '789').then(function () {
                        var requestCall = request.getCall(0),
                            callArgs = requestCall.args;
                        expect(request.calledOnce).to.be.true;
                        expect(callArgs[0]).to.equal(Action.Factory.get('post'));
                        done();
                    });
                });

                it('hits the correct endpoint', function (done) {
                    helper.createAccessToken('123', '456', '789').then(function () {
                        var requestCall = request.getCall(0),
                            callArgs = requestCall.args;
                        expect(callArgs[1]).to.equal('/access_token');
                        done();
                    });
                });

                it('passes the required parameters in the body', function (done) {
                    helper.createAccessToken('123', '456', '789').then(function () {
                        var requestCall = request.getCall(0),
                            callArgs = requestCall.args,
                            callOptions = callArgs[2];
                        expect(callOptions).to.be.an('object').with.property('body');
                        expect(callOptions.body.getRawContent()).to.be.an('object');
                        expect(callOptions.body.getRawContent()).to.have.property('client_id', '123');
                        expect(callOptions.body.getRawContent()).to.have.property('client_secret', '456');
                        expect(callOptions.body.getRawContent()).to.have.property('code', '789');
                        expect(callOptions.body.getRawContent()).not.to.have.property('redirect_uri');
                        expect(callOptions.body.getRawContent()).not.to.have.property('state');
                        done();
                    });
                });

                it('uses a JSON body', function (done) {
                    helper.createAccessToken('123', '456', '789').then(function () {
                        var requestCall = request.getCall(0),
                            callArgs = requestCall.args,
                            callOptions = callArgs[2];
                        expect(callOptions.body.getContentType().getValue())
                            .to.equal('application/json');
                        done();
                    });
                });

                it('passes optional parameters when provided', function (done) {
                    var options = {
                        redirectURI: 'http://www.example.com/redirect',
                        state: 'ABC123'
                    };

                    helper.createAccessToken('123', '456', '789', options).then(function () {
                        var requestCall = request.getCall(0),
                            callArgs = requestCall.args,
                            callOptions = callArgs[2];
                        expect(callOptions.body.getRawContent()).to.have.property('redirect_uri', options.redirectURI);
                        expect(callOptions.body.getRawContent()).to.have.property('state', options.state);
                        done();
                    });
                });

                it('requests for a JSON response', function (done) {
                    helper.createAccessToken('123', '456', '789').then(function () {
                        var requestCall = request.getCall(0),
                            callArgs = requestCall.args, 
                            callOptions = callArgs[2];
                        expect(callOptions).to.be.an('object').with.property('headers');
                        expect(callOptions.headers).to.have.property('Accept', 'application/json');
                        done();
                    });
                });

                it('parses the response', function (done) {
                    helper.createAccessToken('123', '456', '789').then(function (response) {
                        expect(response).to.be.an('object');
                        expect(response).to.have.property('tokenType', githubResponse['token_type']);
                        expect(response).to.have.property('scope', githubResponse['scope']);
                        expect(response).to.have.property('accessToken', githubResponse['access_token']);
                        done();
                    });
                });
            });

            it('handles a request with a failed response', function (done) {
                var err = new HttpError(500, 'Unexpected error'),
                    request = sinon.stub(helper, 'makeRequest').returns(Promise.reject(err));

                helper.createAccessToken('123', '456', '789').catch(function (response) {
                    expect(response).to.exist;
                    expect(response).to.equal(err);
                    done();
                });
            });

            it('handles a GitHub error with a 200 status', function (done) {
                var err = {
                        error: 'bad_verification_code',
                        error_description: 'The code passed is incorrect or expired.',
                        error_uri: 'https://developer.github.com/v3/oauth/#bad-verification-code'
                    },
                    body = new restClient.models.Body(err, 
                        restClient.models.ContentType.Factory.get('application/json')),
                    response = new restClient.models.Response(200, {body: body}),
                    request = sinon.stub(helper, 'makeRequest')
                        .returns(Promise.resolve(response));

                helper.createAccessToken('123', '456', '789').catch(function (error) {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceOf(errors.GitHub);
                    done();
                });
            });
        });
    });
});