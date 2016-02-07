/**
 * Models
 * @module authentication/models
 */

var _ = require('lodash');

var models = {},
    factory;

models = {
    Session: require('./session')
};

factory = _.clone(models);

/**
 * @param {module:database/DataService} dataService 
 */
factory.registerAll = function (dataService) {
    for (var name in models) {
        var initFn = models[name];

        if (!dataService.hasModel(name)) {
            initFn(name, dataService);
        }
    }
};

module.exports = factory;