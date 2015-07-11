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

            contentBuffer = new Buffer(result.content, result.encoding);
            deferred.resolve(contentBuffer.toString());
        });

        return deferred.promise;
    };
};

module.exports = new GitHubDataService();
