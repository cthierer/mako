
define(['logger/logger', 'config/config', 'session/session', 'utils/promise', 'utils/ajax', 'utils/objects'], function (Logger, Config, Session, Promise, Ajax, ObjectUtil) {
    var ContentRetrieverLogger = Logger.get('content.ContentRetriever'),
        ContentRetriever = function () { };

    ContentRetriever.prototype.getPageContent = function (page, options) {
        options = ObjectUtil.defaults(options, {
            extension: '.md'
        });

        return Promise.all([
            Config.get('mako'),
            Session.get('project')
        ]).then(function (results) {

            if (ContentRetrieverLogger.isDebugEnabled()) {
                ContentRetrieverLogger.debug('Loaded config: ', results[0]);
                ContentRetrieverLogger.debug('Loaded session: ', results[1]);
            }

            var mako = results[0],
                project = results[1],
                contentEndpoint = mako.host + mako.endpoints.content,
                path = project.name + '/' + page + options.extension;

            return Ajax.get(contentEndpoint + '/' + path).then(function (response) {
                return response;
            });
        });
    };

    return new ContentRetriever();
});
