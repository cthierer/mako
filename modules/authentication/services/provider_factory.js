/**
 * @module authentication/services/ProviderFactory
 */

var assert = require('assert'),
    _ = require('lodash'),
    ExtendableRouter = require('../../router-extendable').ExtendableRouter;

/**
 * @class
 */
var ProviderFactory = function () {
    var providers = {};

    /**
     * @param {string} name (required)
     * @param {object} configuration (required)
     * @param {module:router-extendable/ExtendableRouter} router (required)
     * @returns {object}
     */
    this.add = function (name, configuration, router) {
        assert(_.isString(name), 'name must be a string');
        assert(!this.has(name), 'name must be unique');
        assert(_.isObject(configuration), 'configuration must be an object');
        assert(router instanceof ExtendableRouter, 'router must be an Extendable Router');

        // TODO ensure that name is URL-safe?

        providers[name] = {
            name: name,
            configuration: configuration,
            router: router
        };

        return providers[name];
    };

    /**
     * @param {string} name (required)
     * @returns {object}
     */
    this.get = function (name) {
        return providers[name];
    };

    /**
     * @returns {array}
     */
    this.getAll = function () {
        return _.values(providers);
    };

    /**
     * @param {string} name (required)
     * @returns {boolean}
     */
    this.has = function (name) {
        return _.has(providers, name);
    };

    /**
     * @param {module:router-extendable/ExtendableRouter} toRouter (required)
     * @returns {module:router-extendable/ExtendableRouter} 
     */
    this.mountAll = function (toRouter) {
        assert(toRouter instanceof ExtendableRouter, 'toRouter must be an Extendable Router');

        for (var name in providers) {
            toRouter.extend(name, providers[name].router);
        }

        return toRouter;
    };
};

module.exports = ProviderFactory;