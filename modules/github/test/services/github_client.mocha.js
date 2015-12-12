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
            github: sandbox.stub().returns({
                authenticate: stubs.github.authenticate,
                user: {
                    get: stubs.github.user.get
                }
            })
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

    describe('getting user by password', function () {
        var client,
            sampleUser;

        beforeEach(function () {
            client = new GitHubClient();
            sampleUser = require('../resources/services/github_client-sample_user.json');
        });

        it('resolves the user with a valid username and password', function (done) {
            var username = 'octocat',
                password = 'password';

            stubs.github.user.get.callsArgWith(1, null, sampleUser);

            client.getUserByPassword(username, password).then(function (user) {
                sinon.assert.calledWith(stubs.github.authenticate, {
                    type: 'basic',
                    username: username,
                    password: password
                });
                sinon.assert.called(stubs.github.user.get);
                expect(user).to.equal(sampleUser);
                done();
            });
        });

        it('throws an exception when the username is not provided', function () {
            var getFn = client.getUserByPassword.bind(client, null, 'password');
            expect(getFn).to.throw(assert.AssertionError, 'username is required');
        });

        it('throws an exception when the username is blank', function () {
            var getFn = client.getUserByPassword.bind(client, '', 'password');
            expect(getFn).to.throw(assert.AssertionError, 'username must not be blank');
        });

        it('throws an exception when the password is not provided', function () {
            var getFn = client.getUserByPassword.bind(client, 'octocat');
            expect(getFn).to.throw(assert.AssertionError, 'password is required');
        });

        it('throws an exception when the password is blank', function () {
            var getFn = client.getUserByPassword.bind(client, 'octocat', '');
            expect(getFn).to.throw(assert.AssertionError, 'password must not be blank');
        });

        it('fails when invalid credentials are provided', function (done) {
            var sampleErr = new Error('{"message":"Bad credentials","documentation_url":"https://developer.github.com/v3"}'),
                AuthenticationError = require('../../errors/authentication');

            sampleErr.code = 401;
            stubs.github.user.get.callsArgWith(1, sampleErr);

            client.getUserByPassword('test', 'password').catch(function (err) {
                expect(err).to.be.an.instanceOf(AuthenticationError);
                expect(err).to.have.property('message', 'Error authenticating user "test": Bad credentials');
                done();
            });
        });

        it('treats other errors as service errors', function (done) {
            var sampleErr = new Error('{"message":"Not found"}'),
                ServiceError = require('../../errors/service');

            stubs.github.user.get.callsArgWith(1, sampleErr);

            client.getUserByPassword('octocat', 'password').catch(function (err) {
                expect(err).to.be.an.instanceOf(ServiceError);
                expect(err).to.have.property('message', 'Not found');
                done();
            });
        });
    });
});
