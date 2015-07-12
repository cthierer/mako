
define(['jquery'], function (jQuery) {
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
    };

    return Article;
});
