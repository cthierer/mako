
define(['jquery', 'eventEmitter', 'utils/objects', 'utils/markdown', 'utils/promise'], function (jQuery, EventEmitter, ObjectUtil, MarkdownUtil, Promise) {
    var Article = function (element, options) {
        var loaded, content, properties;

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

        if (!element.id) {
            element.id = 'article-' + this.getFileName();
        }

        EventEmitter.call(this);
    };

    ObjectUtil.inherits(Article, EventEmitter);

    return Article;
});
