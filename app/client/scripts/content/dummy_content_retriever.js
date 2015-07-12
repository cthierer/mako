
define(['logger/logger', 'config/config', 'session/session', 'utils/promise', 'utils/ajax', 'utils/objects'], function (Logger, Config, Session, Promise, Ajax, ObjectUtil) {
    var ContentRetrieverLogger = Logger.get('content.ContentRetriever'),
        ContentRetriever = function () { };

    ContentRetriever.prototype.getPageContent = function (page, options) {
        var deferred = Promise.pending();

        deferred.resolve({
            "file": page,
            "content": "Lorem ipsum"
        });

        return deferred.promise;
    };

    return new ContentRetriever();
});
