var expect = require('chai').expect,
    assert = require('assert'),
    sinon = require('sinon'),
    github = require('github');

describe('user helper service (v3)', function () {
    var sandbox,
        mocks,
        stubs,
        UserServiceHelper;

    before(function () {
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
            github: {
                authenticate: stubs.github.authenticate,
                user: {
                    get: stubs.github.user.get
                }
            }
        };

        UserServiceHelper = require('../../../../services/helpers/v3/user_service');
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('getting user by password', function () {
        var client,
            sampleUser;

        beforeEach(function () {
            client = new UserServiceHelper(mocks.github);
            sampleUser = require('../../../resources/services/github_client-sample_user.json');
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
                AuthenticationError = require('../../../../errors/authentication');

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
                ServiceError = require('../../../../errors/service');

            stubs.github.user.get.callsArgWith(1, sampleErr);

            client.getUserByPassword('octocat', 'password').catch(function (err) {
                expect(err).to.be.an.instanceOf(ServiceError);
                expect(err).to.have.property('message', 'Not found');
                done();
            });
        });
    });
})
