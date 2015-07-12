
define(['jquery', 'bootstrap', 'eventEmitter', 'utils/lodash', 'utils/objects', 'config/config'], function ($, Bootstrap, EventEmitter, _, ObjectUtil, Config) {
    var Panel = function (options) {
        var self = this,
            element = Config.get('mako.panel').then(function (panel) {
                var render = _.template(panel.panelTemplate),
                    element = $(render(options));

                element.collapse({ toggle: false });
                element.find('a.close').click(function (event) {
                    event.preventDefault();
                    self.close();
                });

                self.setContent(options.content);

                return element.get();
            });

        this.close = function () {
            var self = this;
            this.getElement().then(function (element) {
                $(element).collapse('hide');
                self.emit('panelClosed');
            });
        };

        this.open = function (contentData) {
            var self = this,
                element;

            if (contentData) {
                element = this.setContent(contentData);
            } else {
                element = this.getElement();
            }

            element.then(function (element) {
                $(element).collapse('show');
                self.emit('panelOpened');
            });
        };

        this.setContent = function (data) {
            return this.getElement().then(function (element) {
                var body = $(element).find('.panel-body');
                body.empty();
                body.append($(options.renderer(data)));
                return element;
            });
        };

        this.getElement = function () {
            return element;
        };

        this.addTrigger = function (element) {
            $(element).find('a').click(function (event) {
                event.preventDefault();
                self.open();
            });
        };
    };

    ObjectUtil.inherits(Panel, EventEmitter);

    return Panel;
});
