
define(['jquery', 'bootstrap', 'eventEmitter', 'config/config', 'utils/objects', 'app/panel', 'session/session', 'auth/auth_service'], function ($, Bootstrap, EventEmitter, Config, ObjectUtil, Panel, Session, AuthService) {
    var Toolbar = function () {
        var self = this,
            userElement,
            element = Config.get('mako').then(function (app) {
                var render = _.template(app.toolbar.toolbarTemplate);
                return $(render(app)).get();
            });

        element.then(function (element) {
            $('body').prepend(element);
        });


        this.getUserElement = function () {
            var self = this;
            return Config.get('mako').then(function (app) {
                var render = _.template(app.toolbar.userTemplate);
                return Session.get('user').then(function (user) {
                    var element = $(render({ user: user.username })),
                        panelContents = _.template(app.panel.userTemplate);

                    self.getPanel({
                        title: 'Profile',
                        renderer: panelContents,
                        content: user
                    }).then(function (panel) {
                        panel.addTrigger(element);
                    });

                    return element.get();
                });
            });
        };

        this.getLoginElement = function () {
            var self = this;
            return Config.get('mako').then(function (app) {
                var render = _.template(app.toolbar.loginTemplate),
                    element = $(render({ text: "Log in" })),
                    panelContents = _.template(app.panel.loginTemplate);

                self.getPanel({
                    title: 'Log in',
                    renderer: panelContents
                }).then(function (panel) {
                    panel.addTrigger(element);
                    panel.getElement().then(function (element) {
                        var form = $(element).find('form');
                        form.submit(function (event) {
                            var data = form.serializeArray(),
                                user = {};

                            event.preventDefault();

                            _.each(data, function (value) {
                                user[value.name] = value.value;
                            });

                            AuthService.authenticate(user).then(function () {
                                userElement.then(function (element) {
                                    $(element).remove();
                                    panel.close();
                                    userElement = self.getUserElement().then(function (element) {
                                        self.addSecondaryElement(element);
                                        return element;
                                    });
                                });
                            });
                        });
                    })
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

        Session.isAuthenticated().then(function (authenticated) {
            if (authenticated) {
                userElement = self.getUserElement().then(function (element) {
                    self.addSecondaryElement(element);
                    return element;
                });
            } else {
                userElement = self.getLoginElement().then(function (element) {
                    self.addSecondaryElement(element);
                    return element;
                })
            }
        });
    };

    ObjectUtil.inherits(Toolbar, EventEmitter);

    return Toolbar;
});
