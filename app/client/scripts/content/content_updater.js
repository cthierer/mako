
define(['config/config', 'utils/promise', 'utils/ajax', 'utils/objects', 'session/session'], function (Config, Promise, Ajax, ObjectUtil, Session) {
    var ContentUpdater = function () { };

    ContentUpdater.prototype.saveContent = function (page, content, options) {
        options = ObjectUtil.defaults(options, {
            extension: '.md',
            sha: undefined,
            message: 'Updated using Mako',
            user: {}
        });

        return Promise.all([
            Config.get('mako'),
            Session.get('project')
        ]).then(function (results) {
            var mako = results[0],
                project = results[1],
                contentEndpoint = mako.host + mako.endpoints.content,
                path = project.name + '/' + page + options.extension,
                body = {};

            body.content = content;
            body.sha = options.sha;
            body.message = options.message;
            body.user = options.user;

            return Ajax.put(contentEndpoint + '/' + path, body, {
                dataType: 'json'
            });
        });
    };

    return new ContentUpdater();
});
