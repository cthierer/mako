
define(['jquery', 'bootstrap', 'eventEmitter', 'config/config', 'utils/objects', 'app/panel'], function ($, Bootstrap, EventEmitter, Config, ObjectUtil, Panel) {
    var Toolbar = function () {
        var element = Config.get('mako').then(function (app) {
            var render = _.template(app.toolbar.toolbarTemplate);
            return $(render(app)).get();
        });

        element.then(function (element) {
            $('body').prepend(element);
        });

        this.getUserElement = function () {
            var self = this;
            return Config.get('mako').then(function (app) {
                var render = _.template(app.toolbar.loginTemplate),
                    element = $(render({ text: "Log-in" }));

                self.addSecondaryElement(element);

                self.getPanel({
                    title: 'Lorem ipsum',
                    body: '<p>My sample panel.</p><p>More of my panel</p>'
                }).then(function (panel) {
                    element.find('a').click(function (event) {
                        event.preventDefault();
                        panel.open();
                    });
                });

                return element.get();
            });
        };

        this.getPanel = function (options) {
            var panel = new Panel(options);
            return panel.getElement().then(function (element) {
                $('body').append(element);
                return panel;
            });
        };

        this.addSecondaryElement = function (element) {
            this.getElement().then(function (toolbar) {
                var wrapper = $(toolbar).find("#mako-app-toolbar-secondary");
                wrapper.append(element);
            });
        };

        this.getElement = function () {
            return element;
        };

        this.getUserElement();
    };

    ObjectUtil.inherits(Toolbar, EventEmitter);

    return Toolbar;
});
