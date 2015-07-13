var GitHubAPI = require('github'),
    config = require('config').get('github'),
    Promise = require('bluebird');

var GitHubDataService = function () {
    var api = new GitHubAPI({
        version:    "3.0.0",
        debug:      config.debug        || false,
        protocol:   config.protocol     || 'https',
        host:       config.host         || 'api.github.com',
        pathPrefix: config.pathPrefix   || undefined,
        timeout:    config.timeout      || 5000,
        headers:    config.headers      || {}
    });

    this.updateFileContent = function (owner, repo, branch, path, content, options) {
        var deferred = Promise.pending(),
            params = {};

        params.user = owner;
        params.repo = repo;
        params.ref = branch;
        params.path = path;
        params.content = (new Buffer(content)).toString('base64');

        params.message = options.message;
        params.sha = options.sha;

        api.authenticate({
            type: 'basic',
            username: options.user.username,
            password: options.user.token
        });

        api.repos.updateFile(params, function (err, result) {
            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(result);
        });

        return deferred.promise;
    };

    this.getFileContent = function (owner, repo, branch, path) {
        var deferred = Promise.pending(),
            params = {};

        params.user = owner;
        params.repo = repo;
        params.ref = branch;
        params.path = path;

        api.repos.getContent(params, function (err, result) {
            var contentBuffer;

            if (err) {
                deferred.reject(err);
                return;
            }

            if (result.type !== 'file') {
                deferred.reject(new Error('Unsupported content type returned: ' + result.type));
                return;
            }

            result.content = (new Buffer(result.content, result.encoding)).toString();
            result.encoding = "utf-8";

            deferred.resolve(result);
        });

        return deferred.promise;
    };
};

module.exports = new GitHubDataService();
