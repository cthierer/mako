
define(['utils/lodash', 'utils/objects'], function (_, ObjectUtil) {

    var Logger = function (config) {
        config = ObjectUtil.defaults(config, {
            debug: true,
            error: true,
            logFn: _.bind(console.log, console)
        });

        this.getConfigOption = function (path) {
            return ObjectUtil.get(config, path);
        };
    };

    Logger.DEBUG = 'debug';
    Logger.ERROR = 'error';

    Logger.prototype.isDebugEnabled = function () {
        return this.getConfigOption('debug');
    };

    Logger.prototype.isErrorEnabled = function () {
        return this.getConfigOption('error');
    };

    Logger.prototype.isEnabled = function (level) {
        switch (level) {
            case Logger.DEBUG:
                return this.isDebugEnabled();
                break;
            case Logger.ERROR:
                return this.isErrorEnabled();
                break;
            default:
                return false;
        }
    };

    Logger.prototype.write = function (level) {
        var write = this.getConfigOption('logFn'),
            message = _.toArray(arguments).slice(1);

        if (!this.isEnabled(level) || !_.isFunction(write)) {
            return;
        }

        write.apply(null, message);
    };

    Logger.prototype.debug = function () {
        var args = ([Logger.DEBUG]).concat(_.toArray(arguments));
        return this.write.apply(this, args);
    };

    Logger.prototype.error = function () {
        var args = ([Logger.ERROR]).concat(_.toArray(arguments));
        return this.write.apply(this, args);
    };

    return {
        get: function () {
            return new Logger();
        }
    };
})
