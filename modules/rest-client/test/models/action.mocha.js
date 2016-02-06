var expect = require('chai').expect, 
    assert = require('assert'),
    models = require('../../models'),
    Action = models.Action;

describe('Action model', function () {

    describe('instantiation', function () {

        it('requires that method is a string', function () {
            var initFn = Action.bind(Action, 123);
            expect(initFn).to.throw(assert.AssertionError, 'method must be a string');
        });

        it('requires that method is a valid HTTP method', function () {
            var initFn = Action.bind(Action, 'TEST');
            expect(initFn).to.throw(assert.AssertionError, 'method must be a valid HTTP method');
        });

        it('instantiates with a valid method', function () {
            expect(new Action('GET')).to.be.an('object');
        });
    });

    describe('instantiated model', function () {
        var model;

        beforeEach(function () {
            model = new Action('GET');
        });

        it('retrieves the method', function () {
            expect(model.getMethod()).to.equal('GET');
        });

        describe('request initialization', function () {

            it('fails with missing hostname', function () {
                var initFn = model.initializeRequest.bind(model, {
                    pathname: '/test?query=123'
                });

                expect(initFn).to.throw(assert.AssertionError, 'hostname must be a string');
            });

            it('fails with missing pathname', function () {
                var initFn = model.initializeRequest.bind(model, {
                    hostname: 'http://www.example.com'
                });

                expect(initFn).to.throw(assert.AssertionError, 'pathname must be a string');
            })

            it('returns a Request', function () {
                var result = model.initializeRequest({
                    pathname: '/test?query=123',
                    hostname: 'http://www.example.com'
                });

                expect(result).to.be.an.instanceOf(models.Request);
            });

            it('allows for options to be specified', function () {
                var result = model.initializeRequest({
                    pathname: '/test?query=123',
                    hostname: 'http://www.example.com', 
                    port: 80,
                    parameters: { 'query2': 456 },
                    headers: { 'X-Test-Header': 'test' }
                });

                expect(result).to.be.an.instanceOf(models.Request);
            });

            it.skip('formats the HTTP protocol', function () {});

            it.skip('uses the protocol to load the correct engine', function () {});
        });
    });

    describe('factory', function () {

        function retrieveAndValidateAction (method) {
            var lower = method.toLowerCase(),
                upper = method.toUpperCase();

            validateAction(Action.Factory.get(lower), method);
            validateAction(Action.Factory.get(upper), method);
        }

        function validateAction (action, expectedMethod) {
            expect(action).to.be.an.instanceOf(Action);
            expect(action.getMethod()).to.equal(expectedMethod.toUpperCase());
        };

        it('provides a delete action', function () {
            retrieveAndValidateAction('delete');
        });

        it('provides a get action', function () {
            retrieveAndValidateAction('get');
        });

        it('provides a head action', function () {
            retrieveAndValidateAction('head');
        });

        it('provides a patch action', function () {
            retrieveAndValidateAction('patch');
        });

        it('provides a post action', function () {
            retrieveAndValidateAction('post');
        });

        it('provides a put action', function () {
            retrieveAndValidateAction('put');
        });

        it('provides an options option', function () {
            retrieveAndValidateAction('options');
        });
    });
});