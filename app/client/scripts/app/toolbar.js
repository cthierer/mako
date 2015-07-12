
define(['jquery', 'eventEmitter', 'config/config', 'utils/objects'], function ($, EventEmitter, Config, ObjectUtil) {
    var Toolbar = function () {
        var element = Config.get('app').then(function (app) {
            var render = _.template(app.toolbar.toolbarTemplate);
            return $(render(app)).get();
        });

        element.then(function (element) {
            $('body').prepend(element);
        });

        this.getElement = function () {
            return element;
        };
    };

    ObjectUtil.inherits(Toolbar, EventEmitter);

    return Toolbar;
});
