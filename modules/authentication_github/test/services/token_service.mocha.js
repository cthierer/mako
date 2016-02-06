var expect = require('chai').expect,
    assert = require('assert'),
    sinon = require('sinon'),
    TokenService = require('../../services/token_service'),
    GitHubClient = require('../../../github').services.GitHubClient;

describe('token service', function () {
    var githhubClient;

    function getOAuthOptions (clientId, clientSecret, redirectUri) {
        return {
            client_id: clientId,
            client_secret: clientSecret, 
            redirect_uri: redirectUri
        };
    };

    function getGitHubOptions (oauthOptions) {
        return {
            oauth: oauthOptions
        };
    };

    function getOptions (githubOptions) {
        return {
            github: githubOptions
        };
    };

    beforeEach(function () {
        githubClient = new GitHubClient();
        githubClient.services.oauth.createAccessToken = sinon.stub();
    });

    describe('instantiation', function () {

        it('requires that GitHub client is a valid client service', function () {
            var initNoClient = TokenService.bind(TokenService),
                initFake = TokenService.bind(TokenService, {});

            expect(initNoClient).to.throw(assert.AssertionError, 
                'github client must be an instance of GitHubClient class');
            expect(initFake).to.throw(assert.AssertionError, 
                'github client must be an instance of GitHubClient class');
        });

        it('requires that client ID be defined', function () {
            var initNoOptions = TokenService.bind(TokenService, githubClient),
                initNull = TokenService.bind(TokenService, githubClient, 
                    getOptions(getGitHubOptions(getOAuthOptions(null)))),
                initUndefined = TokenService.bind(TokenService, githubClient, 
                    getOptions(getGitHubOptions(getOAuthOptions())));

            expect(initNoOptions).to.throw(assert.AssertionError, 
                'github client ID must be defined');
            expect(initNull).to.throw(assert.AssertionError, 
                'github client ID must be defined');
            expect(initUndefined).to.throw(assert.AssertionError, 
                'github client ID must be defined');
        });

        it('requires that client secret be defined', function () {
            var initNull = TokenService.bind(TokenService, githubClient, 
                    getOptions(getGitHubOptions(getOAuthOptions('123', null)))),
                initUndefined = TokenService.bind(TokenService, githubClient,
                    getOptions(getGitHubOptions(getOAuthOptions('123'))));

            expect(initNull).to.throw(assert.AssertionError, 
                'github client secret must be defined');
            expect(initUndefined).to.throw(assert.AssertionError, 
                'github client secret must be defined');
        });

        it('requires that redirect URI be defined', function () {
            var initNull = TokenService.bind(TokenService, githubClient,
                    getOptions(getGitHubOptions(getOAuthOptions('123', '456', null)))),
                initUndefined = TokenService.bind(TokenService, githubClient,
                    getOptions(getGitHubOptions(getOAuthOptions('123', '456'))));

            expect(initNull).to.throw(assert.AssertionError,
                'github redirect URI must be defined');
            expect(initUndefined).to.throw(assert.AssertionError,
                'github redirect URI must be defined');
        });
    });

    describe('instantiated service', function () {
        const CLIENT_ID = '123',
            CLIENT_SECRET = '456',
            REDIRECT_URI = 'http://www.example.com';

        var service;

        beforeEach(function () {
            service = new TokenService(githubClient, getOptions(getGitHubOptions(
                getOAuthOptions(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI))));
        });

        it('can be instantiated', function () {
            expect(service).to.exist;
        });

        describe('token creation', function () {
            
            it('creates a token', function (done) {
                const CODE = '789',
                    STATE = '012';

                githubClient.services.oauth.createAccessToken.returns(Promise.resolve({
                    tokenType: 'user',
                    scope: 'profile',
                    accessToken: '123456789'
                }));

                service.createToken(CODE, STATE).then(function (token) {
                    var tokenCreationSpy = githubClient.services.oauth.createAccessToken;
                        tokenCreationArgs = tokenCreationSpy.getCall(0).args;

                    expect(token).to.be.an('object');
                    expect(token).to.have.property('tokenType', 'user');
                    expect(token).to.have.property('scope', 'profile');
                    expect(token).to.have.property('accessToken', '123456789');

                    expect(tokenCreationSpy.calledOnce).to.be.true;
                    expect(tokenCreationArgs[0]).to.equal(CLIENT_ID);
                    expect(tokenCreationArgs[1]).to.equal(CLIENT_SECRET);
                    expect(tokenCreationArgs[2]).to.equal(CODE);
                    expect(tokenCreationArgs[3]).to.be.an('object');
                    expect(tokenCreationArgs[3]).to.have.property('redirectURI', REDIRECT_URI);
                    expect(tokenCreationArgs[3]).to.have.property('state', STATE);

                    done();
                });
            });

            it('enforces that code is a non-empty string', function () {
                var createUndef = service.createToken.bind(service),
                    createNull = service.createToken.bind(service, null),
                    createBlank = service.createToken.bind(service, '');

                expect(createUndef).to.throw(assert.AssertionError, 
                    'code must be a non-empty string');
                expect(createNull).to.throw(assert.AssertionError, 
                    'code must be a non-empty string');
                expect(createBlank).to.throw(assert.AssertionError, 
                    'code must be a non-empty string');
            });
        });
    });
});