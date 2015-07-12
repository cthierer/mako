
define(['jquery', 'logger/logger', 'utils/objects', 'config/config', 'editor/article', 'editor/toolbar'], function ($, Logger, ObjectUtil, Config, Article, Toolbar) {
    var ContentEditorLogger = Logger.get('editor.ContentEditor'),
        ContentEditor;

    ContentEditor = function (article, options) {
        var toolbar = new Toolbar(article),
            self = this;

        if (ContentEditorLogger.isDebugEnabled()) {
            ContentEditorLogger.debug('Started editor for article: ', article);
        }

        this.getArticle = function () {
            return article;
        };

        this.getOptions = function () {
            return options || {}
        };

        this.getOption = function (option) {
            return ObjectUtil.get(this.getOptions(), option);
        };

        this.getToolbar = function () {
            return toolbar;
        };

        toolbar.getButton('Edit', {
            icon: 'edit'
        }).then(function (button) {
            $(button.getElement()).click(function () {
                button.disable();
                self.getArticle().getContent().then(function (content) {
                    self.getEditor(content, button).then(function (editor) {
                        toolbar.getElement().then(function (toolbar) {
                            $(toolbar).after(editor);
                        });
                    });
                });
            });

            toolbar.addButton(button);
        });
    };

    ContentEditor.prototype.getEditor = function (content, button) {
        var self = this;
        return Config.get('editor.editorTemplate').then(function (template) {
            var render = _.template(template),
                element = $(render({ content: content })),
                form = element.find('form').get(0);

            function close () {
                element.remove();
                button.enable();
            };

            element.submit(function (event) {
                var data = $(form).serializeArray(),
                    content = _.where(data, { name: 'content' }).shift().value;

                event.preventDefault();
                self.getArticle().setContent(content);

                close();
            });

            element.find('button[data-action="close"]').click(function (event) {
                event.preventDefault();
                close();
            });

            return element.get();
        });
    };

    return ContentEditor;
});
