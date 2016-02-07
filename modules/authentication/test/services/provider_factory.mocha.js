var expect = require('chai').expect,
    sinon = require('sinon'),
    assert = require('assert'),
    ProviderFactory = require('../../services/provider_factory'),
    ExtendableRouter = require('../../../router-extendable').ExtendableRouter;

describe('provider factory', function () {

    it('can be instantiated', function () {
        var factory = new ProviderFactory();
        expect(factory).to.exist;
    });

    describe('adding providers', function () {
        var factory;

        beforeEach(function () {
            factory = new ProviderFactory();
        });

        it('registers a provider', function () {
            var name = 'Acme test provider',
                configuration = {test:'value'},
                router = new ExtendableRouter(),
                result = factory.add(name, configuration, router);

            expect(result).to.be.an('object');
            expect(result).to.have.property('name', name);
            expect(result).to.have.property('configuration', configuration);
            expect(result).to.have.property('router', router);

            expect(factory.get(name)).to.equal(result);
        });

        it ('enforces that name is a string', function () {
            var name = 123,
                configuration = {test:'value'},
                router = new ExtendableRouter(),
                addFn = factory.add.bind(factory, name, configuration, router);

            expect(addFn).to.throw(assert.AssertionError, 'name must be a string');
        });

        it('enforces that name is unique', function () {
            var provider1,
                provider2,
                result1,
                add2Fn;

            provider1 = {
                name: 'Acme test provider',
                configuration: {test:'value'},
                router: new ExtendableRouter()
            };

            provider2 = {
                name: provider1.name,
                configuration: {test:'value2'},
                router: new ExtendableRouter()
            };

            result1 = factory.add(provider1.name, provider1.configuration, provider1.router);
            add2Fn = factory.add.bind(factory, provider2.name, provider2.configuration, provider2.router);

            expect(result1).to.be.an('object');
            expect(add2Fn).to.throw(assert.AssertionError, 'name must be unique');
        });

        it('enforces that configuration is an object', function () {
            var name = 'Acme test provider',
                configuration = null,
                router = new ExtendableRouter(),
                addFn = factory.add.bind(factory, name, configuration, router);

            expect(addFn).to.throw(assert.AssertionError, 'configuration must be an object');
        });

        it('enforces that router is an Extendable Router', function () {
            var name = 'Acme test provider',
                configuration = {},
                router = {},
                addFn = factory.add.bind(factory, name, configuration, router);

            expect(addFn).to.throw(assert.AssertionError, 'router must be an Extendable Router');
        });
    });

    describe('retrieving providers', function () {
        var factory,
            provider;

        beforeEach(function () {
            factory = new ProviderFactory();
            provider = factory.add('Acme test provider', {test:'value'}, new ExtendableRouter());
        });

        it('retrieves a provider by name', function () {
            var retrieved = factory.get(provider.name);
            expect(retrieved).to.equal(provider);
        });

        it('handles a name miss', function () {
            var retrieved = factory.get('Other provider');
            expect(retrieved).to.be.undefined;
        });

        it('handles blank or missing name', function () {
            expect(factory.get('')).to.be.undefined;
            expect(factory.get()).to.be.undefined;
            expect(factory.get(null)).to.be.undefined;
        });

        it('returns all registered providers', function () {
            var providers = factory.getAll();
            expect(providers).to.be.an('array').with.length(1);
            expect(providers[0]).to.equal(provider);
        });

        it('can check that a provider exists', function () {
            expect(factory.has(provider.name)).to.be.true;
            expect(factory.has('Test provider')).to.be.false;
            expect(factory.has()).to.be.false;
            expect(factory.has(null)).to.be.false;
        });
    });

    describe('mounting providers to another routher', function () {
        var factory,
            provider;

        beforeEach(function () {
            factory = new ProviderFactory();
            provider = factory.add('acme', {test:'value'}, new ExtendableRouter());
        });

        it('mounts providers to another router', function () {
            var otherRouter = new ExtendableRouter(),
                extendSpy = sinon.stub(otherRouter, 'extend'),
                result = factory.mountAll(otherRouter);

            expect(result).to.equal(otherRouter);
            expect(extendSpy.calledOnce).to.be.true;
            expect(extendSpy.getCall(0).args[0]).to.equal(provider.name);
            expect(extendSpy.getCall(0).args[1]).to.equal(provider.router);
        });

        it('verifies that the other router is an Extendable Router', function () {
            var otherRouter = {},
                mountFn = factory.mountAll.bind(factory, otherRouter);

            expect(mountFn).to.throw(assert.AssertionError, 
                'toRouter must be an Extendable Router');
        });
    });
});