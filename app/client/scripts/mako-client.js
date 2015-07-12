require(['jquery', 'logger/logger', 'utils/lodash', 'editor/content_editor', 'editor/article', 'content/dummy_content_retriever', 'config/config', 'session/session', 'styles/styles'], function ($, Logger, _, ContentEditor, Article, ContentRetriever, Config, Session, Styles) {
    var SiteLogger = Logger.get('site');

    function load () {
        return Config.get().then(function (config) {
            return Session.set('project', config.projects[0]).then(function () {
                return config;
            });
        });
    }

    load().then(function (config) {
        var editableSelectors = config.content.selectors.join(','),
            editables = $(editableSelectors);

        SiteLogger.debug('Editable region selectors:', editableSelectors);

        _.each(config.styles.stylesheets, function (stylesheet) {
            Styles.loadStylesheet(stylesheet);
        });

        editables.addClass(config.styles.classes.editable);

        _.each(editables, function (editable) {
            var article = new Article(editable),
                editor = new ContentEditor(article, {
                    contentRetriever: ContentRetriever
                });
        });
    });
});
