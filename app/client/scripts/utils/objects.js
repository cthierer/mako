
define(['utils/lodash'], function (_) {
    return {
        defaults: function (object, defaults) {
            if (!_.isObject(object)) {
                object = {};
            }

            _.defaults(object, defaults);

            return object;
        },
        get: function (object, path) {
            var i = 0,
                value = object,
                parts;

            if (!_.isObject(object) || !_.isString(path)) {
                return object;
            }

            parts = path.split('.');

            while (!_.isUndefined(value) && i < parts.length) {
                var part = parts[i++];

                if (_.has(value, part)) {
                    value = value[part];
                } else {
                    value = undefined;
                }
            }

            return value;
        },
        set: function (object, path, value) {
            var i = 0,
                ref = object,
                parts,
                lastPart;

            if (!_.isObject(object) || !_.isString(path)) {
                return object;
            }

            parts = path.split('.');
            lastPart = parts[parts.length - 1];

            while (i < parts.length - 1) {
                var part = parts[i++];

                if (!_.has(ref, part)) {
                    ref[part] = {};
                }

                ref = ref[part];
            }

            ref[lastPart] = value;

            return object;
        }
    };
});
