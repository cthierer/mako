var path = require('path'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    config = require('config').get('contents'),
    dataService = require('../../github/services/github_data_service');

var ContentService = function () {

};

ContentService.prototype.getProjectConfiguration = function (forProject) {
    var deferred = Promise.pending(),
        projectConfigs = config.projects;

    if (_.isEmpty(projectConfigs) || !_.has(projectConfigs, forProject)) {
        deferred.reject(new Error('No configuration found for project: ' + forProject));
        return;
    }

    deferred.resolve(projectConfigs[forProject]);

    return deferred.promise;
};

ContentService.prototype.getContent = function (project, name, options) {
    if (!_.isObject(options)) {
        options = {};
    }

    return this.getProjectConfiguration(project).then(function (config) {
        var contentPath;

        _.defaults(options, config);

        contentPath = path.posix.join(options.path_to_content, name);

        return dataService.getFileContent(options.owner, options.repo,
            options.branch, contentPath);
    });
};

ContentService.prototype.updateContent = function (project, name, content, options) {
    if (!_.isObject(options)) {
        options = {};
    }

    return this.getProjectConfiguration(project).then(function (config) {
        var contentPath;

        _.defaults(options, config);

        contentPath = path.posix.join(options.path_to_content, name);

        return dataService.updateFileContent(options.owner, options.repo,
            options.branch, contentPath, content, options);
    });
}

module.exports = new ContentService();
