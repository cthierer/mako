
var SessionController = function (sessionService) {

    this.createSession = function (req, res, next) {
        var provider = req.params['provider'];

        // TODO validate that provider is a legal value 

        sessionService.createSession(provider).then(function (id) {
            // TODO want to also include other info for provider, like client id
            res.send({
                'id': id
            });
        }).catch(function (err) {
            res.send(err);
        }).finally(function () {
            next();
        });
    };
};

module.exports = SessionController;