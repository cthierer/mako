
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

                return element.get();
            });

        this.close = function () {
            var self = this;
            this.getElement().then(function (element) {
                $(element).collapse('hide');
                self.emit('panelClosed');
            });
        };

        this.open = function () {
            var self = this;
            this.getElement().then(function (element) {
                $(element).collapse('show');
                self.emit('panelOpened');
            });
        };

        this.getElement = function () {
            return element;
        };
    };

    ObjectUtil.inherits(Panel, EventEmitter);

    return Panel;
});
