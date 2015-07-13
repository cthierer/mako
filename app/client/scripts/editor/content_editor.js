
define(['jquery', 'eventEmitter', 'logger/logger', 'utils/objects', 'config/config', 'editor/article', 'editor/toolbar'], function ($, EventEmitter, Logger, ObjectUtil, Config, Article, Toolbar) {
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
                self.getEditor().then(function (editor) {
                    editor.on('closeEditor', function () {
                        button.enable();
                    });
                });
            });

            toolbar.addButton(button);
        });

        toolbar.getButton('Save', {
            icon: 'save'
        }).then(function (button) {
            button.disable();

            self.getArticle().on('contentSet', function (changed) {
                if (changed) {
                    button.enable();
                }
            });

            $(button.getElement()).click(function () {
                self.getArticle().save({}).then(function (result) {
                    button.disable();
                });
            });

            toolbar.addButton(button);
        });
    };

    ContentEditor.prototype.getEditor = function () {
        var article = this.getArticle(),
            toolbar = this.getToolbar();

        return Promise.all([
            Config.get('editor.editorTemplate'),
            article.getContent(),
            article.getMessage()
        ]).then(function (results) {
            var template = results[0],
                content = results[1],
                message = results[2];

            var Editor = function (content) {
                var render = _.template(template),
                    element = $(render({ content: content, message: message })),
                    form = $(element.find('form').get(0)),
                    self = this;

                form.submit(function (event) {
                    var data = form.serializeArray(),
                        content = _.where(data, { name: 'content' }).shift().value,
                        message = _.where(data, { name: 'message' }).shift().value;

                    event.preventDefault();
                    article.setContent(content);
                    article.setMessage(message);
                    self.emit('setContent');
                    self.close();
                });

                element.find('button[data-action="close"]').click(function (event) {
                    event.preventDefault();
                    self.close();
                });

                toolbar.getElement().then(function (toolbar) {
                    element.collapse();
                    $(toolbar).after(element.get());
                    element.collapse('show');
                });

                this.close = function () {
                    element.collapse('hide');
                    setTimeout(function () { element.remove(); }, 1000);
                    self.emit('closeEditor');
                };

                this.getElement = function () {
                    return element;
                };
            };

            ObjectUtil.inherits(Editor, EventEmitter);

            return new Editor(content);
        });
    };

    return ContentEditor;
});
