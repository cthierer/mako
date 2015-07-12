
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

        this.getContentRetriever = function () {
            return this.getOption('contentRetriever');
        };

        this.getToolbar = function () {
            return toolbar;
        };

        toolbar.getButton('Edit', {
            icon: 'edit'
        }).then(function (button) {
            $(button).click(function () {
                var element = $(this);

                element.prop('disabled', true);
                self.getSourceContent().then(function (content) {
                    self.getEditor(content.content, element).then(function (editor) {
                        toolbar.getElement().then(function (toolbar) {
                            $(toolbar).after(editor);
                        });
                    });
                });
            });

            toolbar.addButton(button);
        });
    };

    ContentEditor.prototype.getEditor = function (content, trigger) {
        var self = this;
        return Config.get('editor.editorTemplate').then(function (template) {
            var render = _.template(template),
                element = $(render({ content: content })),
                form = element.find('form').get(0);

            function close () {
                element.remove();
                $(trigger).prop('disabled', false);
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

    ContentEditor.prototype.getSourceContent = function () {
        var page = this.getArticle().getFileName(),
            contentRetriever = this.getContentRetriever();

        return contentRetriever.getPageContent(page);
    };

    return ContentEditor;
});
