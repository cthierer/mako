
define(['jquery', 'utils/markdown'], function (jQuery, MarkdownUtil) {
    var Article = function (element) {
        if (element instanceof jQuery) {
            element = element.get();
        }

        this.getElement = function () {
            return element;
        };

        this.getDataAttribute = function (name) {
            return this.getElement().dataset[name];
        };

        this.getFileName = function () {
            return this.getDataAttribute('file');
        };

        this.getId = function () {
            return this.getElement().id;
        };

        this.setContent = function (markdown) {
            var html = MarkdownUtil.render(markdown);
            this.getElement().innerHTML = html;
        };

        if (!element.id) {
            element.id = 'article-' + this.getFileName();
        }
    };

    return Article;
});
