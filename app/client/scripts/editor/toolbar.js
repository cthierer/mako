
define(["jquery", "utils/lodash", "utils/objects", "config/config"], function ($, _, ObjectUtil, Config) {
    var Toolbar = function (article) {
        element = Config.get("editor.toolbar").then(function (toolbar) {
            var render = _.template(toolbar.toolbarTemplate);
            return $(render({ buttons: [] })).get();
        });

        element.then(function (element) {
            $(article.getElement()).after(element);
        });

        this.getArticle = function () {
            return article;
        };

        this.getElement = function () {
            return element;
        };
    };

    Toolbar.prototype.getButton = function (label, options) {
        options = ObjectUtil.defaults(options, {
            label: label
        });

        options.article = this.getArticle();

        return Config.get("editor.toolbar").then(function (toolbar) {
            var render = _.template(toolbar.buttonTemplate);
            return $(render(options)).get();
        });
    };

    Toolbar.prototype.addButton = function (button) {
        this.getElement().then(function (element) {
            $(element).append(button);
        });
    };

    return Toolbar;
});
