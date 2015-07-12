// TODO eliminate this global
var sessionData = {};

define(['logger/logger', 'utils/lodash', 'utils/objects', 'utils/promise'], function (Logger, _, ObjectUtil, Promise) {
    var SessionLogger = Logger.get('session.Session'),
        Session = function () {
            if (SessionLogger.isDebugEnabled()) {
                SessionLogger.debug('Initializing new session...');
            }

            this.data = sessionData;
        };

    Session.prototype.get = function (property) {
        var deferred = Promise.pending(),
            result = ObjectUtil.get(this.data, property);

        if (SessionLogger.isDebugEnabled()) {
            SessionLogger.debug('Got session property "', property,
                '": ', result);
        }

        deferred.resolve(result);

        return deferred.promise;
    };

    Session.prototype.set = function (property, value) {
        var deferred = Promise.pending(),
            result = ObjectUtil.set(this.data, property, value);

        if (SessionLogger.isDebugEnabled()) {
            SessionLogger.debug('Set session property "', property,
                '" to value "', value, '": ', result);
        }

        deferred.resolve(result);

        return deferred.promise;
    };

    return new Session();
});
