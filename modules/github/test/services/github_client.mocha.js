var expect = require('chai').expect,
    assert = require('assert'),
    sinon = require('sinon'),
    mockery = require('mockery'),
    github = require('github');

describe('GitHub client', function () {
    var sandbox,
        mocks,
        stubs,
        GitHubClient;

    before(function () {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });

        sandbox = sinon.sandbox.create();

        stubs = {
            github: {
                authenticate: sandbox.stub(),
                user: {
                    get: sandbox.stub()
                }
            }
        };

        mocks = {
            github: sandbox.stub().returns({})
        };

        mockery.registerMock('github', mocks.github);
        GitHubClient = require('../../services/github_client');
    });

    after(function () {
        mockery.disable();
    });

    afterEach(function () {
        sandbox.restore();
        mockery.deregisterAll();
    });

    describe('instantiation', function () {
        var defaults;

        beforeEach(function () {
            defaults = {
                version: '3.0.0',
                debug: false,
                protocol: 'https',
                host: 'api.github.com',
                timeout: 5000,
                headers: {}
            };
        });

        it('uses defaults when no options are provided', function () {
            var client = new GitHubClient();
            sinon.assert.calledWith(mocks.github, defaults);
        });

        it('allows debug to be overriden', function () {
            var client = new GitHubClient({debug: true});
            defaults.debug = true;
            sinon.assert.calledWith(mocks.github, defaults);
        });

        it('allows for protocol to be overridden', function () {
            var client = new GitHubClient({protocol: 'http'});
            defaults.protocol = 'http';
            sinon.assert.calledWith(mocks.github, defaults);
        });

        it('allows for host to be overriden', function () {
            var client = new GitHubClient({host: 'api.test.com'});
            defaults.host = 'api.test.com';
            sinon.assert.calledWith(mocks.github, defaults);
        });

        it('allows for timeout to be overriden', function () {
            var client = new GitHubClient({timeout: 1000});
            defaults.timeout = 1000;
            sinon.assert.calledWith(mocks.github, defaults);
        });

        it('allows for headers to be overriden', function () {
            var client = new GitHubClient({headers: {test: 'test'}});
            defaults.headers = {test: 'test'};
            sinon.assert.calledWith(mocks.github, defaults);
        });

        it('allows for pathPrefix to be specified', function () {
            var client = new GitHubClient({pathPrefix: '/test/'});
            defaults.pathPrefix = '/test/';
            sinon.assert.calledWith(mocks.github, defaults);
        });

        it('does not allow for version to be overriden', function () {
            var client = new GitHubClient({version: '4.0.0'});
            sinon.assert.calledWith(mocks.github, defaults);
        });

        it('does not modify the existing object', function () {
            var client;

            // do not include version in input options
            // expect it to be set by the client
            delete defaults.version;
            client = new GitHubClient(defaults);

            // expect the local object to not have version set
            // even though it was set in the constructor
            expect(defaults).to.not.have.property('version');
        });
    });

    describe('versioning', function () {
        var client;

        beforeEach(function () {
            client = new GitHubClient();
        });

        it('uses version 3.0.0', function () {
            expect(client.getVersion()).to.equal('3.0.0');
        });
    });

    describe('services', function () {
        var UserServiceHelper = require('../../services/helpers/v3/user_service'),
            OAuthServiceHelper = require('../../services/helpers/v3/oauth_service'),
            client;

        beforeEach(function () {
            client = new GitHubClient();
        });

        it('has a services property', function () {
            expect(client).to.have.property('services').that.is.an('object');
        });

        it('includes a user service instance', function () {
            expect(client.services).to.have.property('user').
                that.is.an.instanceOf(UserServiceHelper);
        });

        it('includes an oauth service instance', function () {
            expect(client.services).to.have.property('oauth').
                that.is.an.instanceOf(OAuthServiceHelper);
        });
    });
});
