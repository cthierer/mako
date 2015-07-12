
define(['eventEmitter', 'utils/objects', 'session/session'], function (EventEmitter, ObjectUtil, Session) {
    var AuthService = function () {

        this.authenticate = function (login) {            
            var user = {
                username: login.username,
                token: login.password
            };

            this.emit('authenticated', user);

            return Session.set('user', user);
        };
    };

    ObjectUtil.inherits(AuthService, EventEmitter);

    return new AuthService();
});
