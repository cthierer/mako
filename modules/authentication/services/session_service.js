
var crypto = require('crypto'),
    uuid = require('uuid'),
    Promise = require('bluebird'),
    logger = require('log4js').getLogger();

var SessionService = function (dataService) {
    var Session = dataService.getModel('Session');

    // TODO convert to utility 
    function getToken () {
        var deferred = Promise.pending();

        crypto.randomBytes(191, function (err, buf) {
            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(buf.toString('base64'));
        });

        return deferred.promise;
    };

    this.createSession = function (provider) {
        var model = new Session({
                'id': uuid.v4(),
                'provider': provider,
                'is_active': false
            });

        return getToken().then(function (token) {
            return model.save({'app_token': token}, {
                method: 'insert'
            }).then(function (model) {
                return model.get('id');
            }).catch(function (err) {
                logger.error('Encountered error while saving Session:', err);
                throw err;
            });
        });
    };
};

module.exports = SessionService;