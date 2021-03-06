require(['jquery', 'logger/logger', 'utils/lodash', 'editor/content_editor', 'editor/article', 'content/content_retriever', 'content/content_updater', 'config/config', 'session/session', 'styles/styles', 'app/toolbar'], function ($, Logger, _, ContentEditor, Article, ContentRetriever, ContentUpdater, Config, Session, Styles, AppToolbar) {
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
            editables = $(editableSelectors),
            toolbar = new AppToolbar();

        SiteLogger.debug('Editable region selectors:', editableSelectors);

        _.each(config.styles.stylesheets, function (stylesheet) {
            Styles.loadStylesheet(stylesheet);
        });

        editables.addClass(config.styles.classes.editable);

        _.each(editables, function (editable) {
            var article = new Article(editable, {
                    contentRetriever: ContentRetriever,
                    contentUpdater: ContentUpdater
                }),
                editor = new ContentEditor(article, { });
        });
    });
});
