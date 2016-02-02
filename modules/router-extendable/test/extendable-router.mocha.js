var expect = require('chai').expect,
    sinon = require('sinon'),
    assert = require('assert'),
    Router = require('restify-router').Router,
    ExtendableRouter = require('../extendable-router'); 

describe('extendable router', function () {

    function simpleHandler (req, res, next) {
        next();
    };

    it('extends the Restify Router module', function () {
        var router = new ExtendableRouter();
        expect(router).to.be.an.instanceOf(Router);
    });

    describe('extending routes', function () {
        var router;

        function getBasicRouter () {
            var router = new ExtendableRouter();
            router.get('/simple', simpleHandler);
            return router;
        };

        beforeEach(function () {
            router = new ExtendableRouter();
            router.get('/base', simpleHandler);
        });

        it('can be extended', function () {
            var secondRouter = getBasicRouter();

            router.extend('test', secondRouter);

            expect(router.nextRouters).to.be.an('array').with.length(1);
            expect(router.nextRouters[0]).to.be.an('object');
            expect(router.nextRouters[0]).to.have.property('prefix', 'test');
            expect(router.nextRouters[0]).to.have.property('router', secondRouter);
        });

        it('applies the extended routes to the server', function () {
            var secondRouter = getBasicRouter(),
                server = {},
                firstCall,
                secondCall;

            router.applyRoutes = sinon.stub();
            secondRouter.applyRoutes = sinon.stub();

            router.extend('test', secondRouter);
            router.apply(server, 'api');

            expect(router.applyRoutes.calledOnce).to.be.true;
            expect(secondRouter.applyRoutes.calledOnce).to.be.true;

            firstCall = router.applyRoutes.getCall(0);
            secondCall = secondRouter.applyRoutes.getCall(0);

            expect(firstCall.args[0]).to.equal(server);
            expect(firstCall.args[1]).to.equal('/api')

            expect(secondCall.args[0]).to.equal(server);
            expect(secondCall.args[1]).to.equal('/api/test');
        });

        it('requires that prefix be specified', function () {
            var extendFn = router.extend.bind(router, '');
            expect(extendFn).to.throw(assert.AssertionError, 'prefix must be a non-empty string');
        });

        it('requires that router be an Extendable Router', function () {
            var extendFn = router.extend.bind(router, 'api', new Router());
            expect(extendFn).to.throw(assert.AssertionError, 'router must be an Extendable Router');
        })
    });

    describe('applying routes', function () {
        var router; 

        beforeEach(function () {
            router = new ExtendableRouter();
            router.get('/base', simpleHandler);
        });

        it('handles redundant opening slashes', function () {
            var server = {};

            router.applyRoutes = sinon.stub();
            router.apply(server, '/api');

            expect(router.applyRoutes.getCall(0).args[1]).to.equal('/api');
        });
    });
});