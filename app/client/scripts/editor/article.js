
define(['jquery', 'eventEmitter', 'utils/objects', 'utils/markdown', 'utils/promise', 'session/session'], function (jQuery, EventEmitter, ObjectUtil, MarkdownUtil, Promise, Session) {
    var Article = function (element, options) {
        var loaded, content, properties, meta = {};

        if (element instanceof jQuery) {
            element = element.get();
        }

        this.getContent = function () {
            var deferred = Promise.pending();

            if (!content) {
                var contentRetriever = this.getContentRetriever(),
                    page = this.getFileName();

                contentRetriever.getPageContent(page).then(function (result) {
                    loaded = MarkdownUtil.parse(result.content);

                    properties = loaded.properties;
                    content = loaded.content;

                    meta.sha = result.sha;

                    deferred.resolve(content);
                }).catch(function (err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve(content);
            }

            return deferred.promise;
        };

        this.getContentRetriever = function () {
            return this.getOption('contentRetriever');
        };

        this.getContentUpdater = function () {
            return this.getOption('contentUpdater');
        };

        this.getDataAttribute = function (name) {
            return this.getElement().dataset[name];
        };

        this.getElement = function () {
            return element;
        };

        this.getFileName = function () {
            return this.getDataAttribute('file');
        };

        this.getId = function () {
            return this.getElement().id;
        };

        this.getOptions = function () {
            return options || {};
        };

        this.getOption = function (option) {
            return ObjectUtil.get(this.getOptions(), option);
        };

        this.getDocumentProperties = function () {
            var deferred = Promise.pending();
            deferred.resolve(properties);
            return deferred.promise;
        };

        this.getMetaProperties = function () {
            var deferred = Promise.pending();
            deferred.resolve(meta);
            return deferred.promise;
        };

        this.hasChanged = function () {
            return loaded.content != content;
        };

        this.setContent = function (markdown) {
            var html = MarkdownUtil.render(markdown),
                changed = content != markdown;

            content = markdown;
            this.getElement().innerHTML = html;

            this.emit('contentSet', changed);
        };

        this.save = function (options) {
            var contentUpdater = this.getContentUpdater(),
                page = this.getFileName();

            if (!options) {
                options = {};
            }

            return Promise.all([
                this.getContent(),
                this.getDocumentProperties(),
                this.getMetaProperties(),
                Session.get('user')
            ]).then(function (results) {
                var content = results[0],
                    frontMatter = results[1],
                    meta = results[2],
                    user = results[3],
                    mdDoc = MarkdownUtil.toDocument(content, frontMatter);

                return contentUpdater.saveContent(page, mdDoc, {
                    sha: meta.sha,
                    message: options.message,
                    user: user
                });
            });
        };

        if (!element.id) {
            element.id = 'article-' + this.getFileName();
        }

        EventEmitter.call(this);
    };

    ObjectUtil.inherits(Article, EventEmitter);

    return Article;
});
