var expect = require('chai').expect,
    sinon = require('sinon'),
    assert = require('assert'),
    Promise = require('bluebird'),
    TokenController = require('../../controllers/token_controller');

describe('token controller', function () {

    it('requires an instance of token service', function () {
        var initFn = TokenController.bind(TokenController);
        expect(initFn).to.throw(assert.AssertionError, 
            'tokenService must be defined');
    });

    describe('instantiation', function () {
        var tokenService,
            controller;

        beforeEach(function () {
            tokenService = { createToken: sinon.stub() };
            controller = new TokenController(tokenService);
        });

        describe('creating a token', function () {

            it('creates a token', function (done) {
                var req = {query: {}},
                    res = {send: sinon.stub()};

                tokenService.createToken.returns(Promise.resolve());

                controller.createToken(req, res, function (err) {
                    expect(err).not.to.exist;
                    expect(tokenService.createToken.calledOnce).to.be.true;
                    done();
                });
            });

            it('pulls code from the query string', function (done) {
                var req = {query: {code: '1234'}},
                    res = {send: sinon.stub()};

                tokenService.createToken.returns(Promise.resolve());

                controller.createToken(req, res, function () {
                    var fnCall = tokenService.createToken.getCall(0),
                        args = fnCall.args;

                    expect(args[0]).to.equal('1234');
                    done();
                });
            });

            it('pulls state from the query string', function (done) {
                var req = {query: {state: '4567'}},
                    res = {send: sinon.stub()};

                tokenService.createToken.returns(Promise.resolve());

                controller.createToken(req, res, function() {
                    var fnCall = tokenService.createToken.getCall(0),
                        args = fnCall.args;

                    expect(args[1]).to.equal('4567');
                    done();
                });
            });
        });
    });
});